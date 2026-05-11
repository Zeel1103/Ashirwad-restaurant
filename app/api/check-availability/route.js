import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventDate, eventTimeStart, bookingType } = body;

    if (!eventDate || !eventTimeStart || !bookingType) {
      return NextResponse.json(
        { error: "Date, time, and booking type are required" },
        { status: 400 }
      );
    }

    const sql = getDb();
    if (!sql) {
      // No database, assume available
      return NextResponse.json({ available: true });
    }

    // For banquet hall bookings, check if there's any overlapping booking
    if (bookingType === "Banquet") {
      const conflictingBookings = await sql`
        SELECT id FROM banquet_inquiries
        WHERE event_date = ${eventDate}
        AND booking_type = 'Banquet'
        AND booking_status IN ('confirmed', 'pending')
        AND (
          (event_time_start::time <= ${eventTimeStart}::time AND event_time_end::time > ${eventTimeStart}::time)
        )
        LIMIT 1
      `;

      if (conflictingBookings.length > 0) {
        return NextResponse.json({ 
          available: false, 
          message: "This time slot is already booked for the Banquet Hall" 
        });
      }
    }

    // Table bookings can have multiple bookings at same time
    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json({ 
      error: "Failed to check availability",
      available: true // Default to available if error
    }, { status: 500 });
  }
}
