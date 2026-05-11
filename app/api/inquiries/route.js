import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

function calculateDuration(startTime, endTime) {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;
  return (endMins - startMins) / 60;
}

function calculateAmount(bookingType, duration) {
  if (bookingType === "Banquet") {
    return Math.ceil(duration * 5000); // 5000 per hour
  }
  return 0; // Table bookings may not have fixed pricing
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, eventType, eventDate, eventTimeStart, eventTimeEnd, bookingType, guests, message } = body;

    if (!name || !phone || !eventType || !eventDate || !eventTimeStart || !eventTimeEnd || !bookingType) {
      return NextResponse.json(
        { error: "All required fields (name, phone, event type, date, time range, booking type) must be provided" },
        { status: 400 }
      );
    }

    const sql = getDb();
    
    // Check availability for Banquet bookings
    if (sql && bookingType === "Banquet") {
      const conflictingBookings = await sql`
        SELECT id FROM banquet_inquiries
        WHERE event_date = ${eventDate}
        AND booking_type = 'Banquet'
        AND booking_status IN ('confirmed', 'pending')
        AND (
          (event_time_start::time < ${eventTimeEnd}::time AND event_time_end::time > ${eventTimeStart}::time)
        )
        LIMIT 1
      `;

      if (conflictingBookings.length > 0) {
        return NextResponse.json(
          { error: "This time slot is already booked for the Banquet Hall. Please choose a different time." },
          { status: 409 }
        );
      }
    }

    const duration = calculateDuration(eventTimeStart, eventTimeEnd);
    const totalAmount = calculateAmount(bookingType, duration);
    const advanceAmount = 0; // No advance payment required

    if (sql) {
      await sql`
        INSERT INTO banquet_inquiries 
        (name, phone, email, event_type, event_date, event_time_start, event_time_end, booking_type, guests, message, duration_hours, total_amount, advance_amount, payment_status, booking_status)
        VALUES (${name}, ${phone}, ${email || null}, ${eventType}, ${eventDate}, ${eventTimeStart}, ${eventTimeEnd}, ${bookingType}, ${guests || null}, ${message || null}, ${duration}, ${totalAmount}, ${advanceAmount}, 'pending', 'pending')
      `;
    }

    // Return success immediately - emails will be sent in background
    const responseData = {
      success: true,
      message: `Booking submitted successfully! Booking ID: ${Date.now()}`,
      booking: {
        name,
        phone,
        bookingType,
        eventDate,
        eventTimeStart,
        eventTimeEnd,
        duration: duration.toFixed(1),
        totalAmount: bookingType === "Banquet" ? totalAmount : null,
        advanceAmount: bookingType === "Banquet" ? advanceAmount : null,
      }
    };

    // Send emails (awaiting to ensure delivery in serverless environment)
    await sendEmailsInBackground(name, phone, email, eventType, eventDate, eventTimeStart, eventTimeEnd, bookingType, guests, message, duration, totalAmount, advanceAmount);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

// Send emails in background without blocking the API response
async function sendEmailsInBackground(name, phone, email, eventType, eventDate, eventTimeStart, eventTimeEnd, bookingType, guests, message, duration, totalAmount, advanceAmount) {
  const managerEmail = process.env.MANAGER_EMAIL || "your-email@gmail.com";
  const whatsappNumber = "918511575440"; // Your WhatsApp number
  
  const sendEmail = async ({ to, subject, htmlContent }) => {
    if (!process.env.BREVO_API_KEY) {
      console.log("⚠️ BREVO_API_KEY not configured - emails will not be sent");
      return;
    }
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sender: { name: "Ashirwad 2 Restaurant", email: managerEmail },
          to: [{ email: to }],
          subject: subject,
          htmlContent: htmlContent
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ Brevo API Error:", errorData);
      } else {
        console.log(`✅ Email successfully sent to ${to}`);
      }
    } catch (err) {
      console.error("❌ Email send exception:", err);
    }
  };

  const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  function formatTimeDisplay(time24) {
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${String(m).padStart(2, "0")} ${period}`;
  }

  const whatsappPaymentLink = `https://wa.me/${whatsappNumber}?text=Hi! I have booked a ${bookingType} on ${formattedDate}. Booking ID: ${Date.now()}. Advance amount due: ₹${advanceAmount}. Please share payment details.`;

  // 1. Notify Manager
  await sendEmail({
    to: managerEmail,
    subject: `New ${bookingType} Booking: ${name}`,
    htmlContent: `
      <div style="font-family: sans-serif; padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #c41e3a;">New Booking Received!</h2>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Type:</strong> ${bookingType} - ${eventType}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${formatTimeDisplay(eventTimeStart)} to ${formatTimeDisplay(eventTimeEnd)}</p>
        <p><strong>Duration:</strong> ${duration.toFixed(1)} hours</p>
        <p><strong>Guests:</strong> ${guests || "Not specified"}</p>
        ${bookingType === "Banquet" ? `
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        ` : ""}
        <p><strong>Message:</strong> ${message || "None"}</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0;">
        <p style="color: #666; font-size: 0.85em;">Payment Status: Pending | Booking Status: Pending</p>
      </div>
    `
  });

  // 2. Notify Customer
  if (email) {
    await sendEmail({
      to: email,
      subject: "Booking Confirmation - Ashirwad 2 Restaurant",
      htmlContent: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #c41e3a;">Thank you for your booking, ${name}!</h2>
          <p>We have successfully received your request for a <strong>${bookingType}</strong> on <strong>${formattedDate}</strong> from <strong>${formatTimeDisplay(eventTimeStart)}</strong> to <strong>${formatTimeDisplay(eventTimeEnd)}</strong>.</p>
          ${bookingType === "Banquet" ? `
            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin-top: 0; color: #c41e3a;">💰 Amount Details:</h3>
              <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
              <p style="color: #666; font-size: 0.9em;">Payment can be made at the venue.</p>
            </div>
          ` : ""}
          <p>Our manager will review your request and contact you shortly at <strong>${phone}</strong> to finalize the details and arrange payment if needed.</p>
          <p>We look forward to hosting you!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 0.9em;">Best regards,<br><strong>Ashirwad 2 Restaurant & Banquet</strong><br>Ankleshwar, Gujarat</p>
        </div>
      `
    });
  }
}
