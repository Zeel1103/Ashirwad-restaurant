"use client";
import { useState } from "react";
import TimeSlotPicker from "./TimeSlotPicker";
import CustomDatePicker from "./CustomDatePicker";

function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return 0;
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

export default function Banquet() {
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    bookingType: "Table", 
    eventType: "", 
    eventDate: "", 
    eventTimeStart: "", 
    eventTimeEnd: "", 
    guests: "", 
    message: "" 
  });
  const [status, setStatus] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");

  const duration = calculateDuration(form.eventTimeStart, form.eventTimeEnd);
  const totalAmount = calculateAmount(form.bookingType, duration);

  const handleTimeChange = (timeData) => {
    setForm({
      ...form,
      eventTimeStart: timeData.start,
      eventTimeEnd: timeData.end,
    });
    setAvailabilityError("");
  };

  const handleDateChange = (dateStr) => {
    setForm({
      ...form,
      eventDate: dateStr,
    });
    setAvailabilityError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setAvailabilityError("");

    try {
      // Check availability for Banquet bookings
      if (form.bookingType === "Banquet") {
        const availRes = await fetch("/api/check-availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventDate: form.eventDate,
            eventTimeStart: form.eventTimeStart,
            bookingType: form.bookingType,
          }),
        });
        const availData = await availRes.json();
        if (!availData.available) {
          setAvailabilityError(availData.message || "Time slot not available");
          setStatus("");
          return;
        }
      }

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          bookingType: form.bookingType,
          eventType: form.eventType,
          eventDate: form.eventDate,
          eventTimeStart: form.eventTimeStart,
          eventTimeEnd: form.eventTimeEnd,
          guests: form.guests,
          message: form.message,
        }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStatus("success");
        setSubmittedPhone(form.phone);
        setForm({ 
          name: "", 
          phone: "", 
          email: "", 
          bookingType: "Table", 
          eventType: "", 
          eventDate: "", 
          eventTimeStart: "", 
          eventTimeEnd: "", 
          guests: "", 
          message: "" 
        });
        setTimeout(() => {
          setStatus("");
          setSubmittedPhone("");
        }, 8000);
      } else {
        setAvailabilityError(data.error || "Something went wrong");
        setStatus("error");
      }
    } catch {
      setStatus("error");
      setAvailabilityError("Failed to submit booking");
    }
  };

  const events = [
    { icon: "🎂", title: "Birthday Parties", desc: "Make birthdays magical with custom decor and special menus" },
    { icon: "👨‍👩‍👧‍👦", title: "Family Functions", desc: "Spacious hall perfect for family get-togethers and celebrations" },
    { icon: "🤝", title: "Small Gatherings", desc: "Intimate settings for kitty parties, meetings, and more" },
    { icon: "💍", title: "Engagement & Weddings", desc: "Beautiful arrangements for your most special moments" },
  ];

  return (
    <section className="section" id="banquet">
      <div className="section-header">
        <span className="section-label">Celebrations</span>
        <h2 className="section-title">Reservations & Events</h2>
        <div className="section-divider"></div>
      </div>
      <div className="banquet-grid">
        <div className="banquet-cards">
          <div className="about-image" style={{ marginBottom: "1.5rem" }}>
            <img src="/images/banquet-hall.png" alt="Ashirwad 2 Banquet Hall decorated for events" style={{ height: "220px", width: "100%", objectFit: "cover", borderRadius: "16px" }} />
          </div>
          {events.map((ev, i) => (
            <div className="banquet-card" key={i}>
              <span className="banquet-icon">{ev.icon}</span>
              <div>
                <h4>{ev.title}</h4>
                <p>{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="banquet-form">
          <h3>📋 Book Table or Banquet</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Booking Type *</label>
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--cream-light)", cursor: "pointer" }}>
                  <input type="radio" name="bookingType" value="Table" checked={form.bookingType === "Table"} onChange={(e) => setForm({ ...form, bookingType: e.target.value })} style={{ width: "auto" }} />
                  Table Booking
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--cream-light)", cursor: "pointer" }}>
                  <input type="radio" name="bookingType" value="Banquet" checked={form.bookingType === "Banquet"} onChange={(e) => setForm({ ...form, bookingType: e.target.value })} style={{ width: "auto" }} />
                  Banquet Hall
                </label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Event Type *</label>
                <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} required>
                  <option value="">Select event type</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="family">Family Function</option>
                  <option value="gathering">Small Gathering</option>
                  <option value="engagement">Engagement</option>
                  <option value="wedding">Wedding</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <CustomDatePicker selectedDate={form.eventDate} onDateChange={handleDateChange} />
              </div>
            </div>
            <TimeSlotPicker 
              startTime={form.eventTimeStart}
              endTime={form.eventTimeEnd}
              onTimeChange={handleTimeChange}
              selectedDate={form.eventDate}
              bookingType={form.bookingType}
            />
            {availabilityError && (
              <div style={{ background: "#C41E3A", color: "white", padding: "0.75rem", borderRadius: "8px", marginTop: "0.75rem", fontSize: "0.9rem" }}>
                ⚠️ {availabilityError}
              </div>
            )}
            <div className="form-group">
              <label>Number of Guests</label>
              <input type="number" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} placeholder="Approximate number" />
            </div>

            {form.bookingType === "Banquet" && form.eventTimeStart && form.eventTimeEnd && (
              <div style={{ background: "var(--dark-2)", border: "1px solid var(--gold)", padding: "1rem", borderRadius: "8px", marginTop: "1rem" }}>
                <h4 style={{ color: "var(--gold)", marginTop: 0 }}>💰 Booking Information</h4>
                <div style={{ fontSize: "0.9rem", color: "var(--cream-light)" }}>
                  <p><strong>Duration:</strong> {duration.toFixed(1)} hours</p>
                  <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Payment can be made at the venue.</p>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Message</label>
              <textarea rows="3" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Any special requirements..." />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={status === "sending"}>
              {status === "sending" ? "Submitting..." : "Submit Inquiry"}
            </button>
            {status === "success" && (
              <div style={{ background: "#25D366", color: "white", padding: "1rem", borderRadius: "8px", marginTop: "1rem", textAlign: "center" }}>
                <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>✅ Booking Submitted Successfully!</p>
                <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>Our manager will contact you shortly at {submittedPhone}</p>

              </div>
            )}
            {status === "error" && availabilityError && <p style={{ color: "#C41E3A", marginTop: "1rem", textAlign: "center" }}>❌ {availabilityError}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
