"use client";
import { useState, useEffect } from "react";

export default function TimeSlotPicker({ startTime, endTime, onTimeChange, selectedDate, bookingType }) {
  const [showPicker, setShowPicker] = useState(false);
  const [hours, setHours] = useState([]);

  // Generate time slots (30 min increments from 10 AM to 11 PM)
  useEffect(() => {
    const slots = [];
    for (let h = 10; h <= 23; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      if (h < 23) slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    setHours(slots);
  }, []);

  const handleStartTimeSelect = (time) => {
    onTimeChange({ start: time, end: endTime });
    setShowPicker(false);
  };

  const handleEndTimeSelect = (time) => {
    onTimeChange({ start: startTime, end: time });
    setShowPicker(false);
  };

  // Format time for display
  const formatTime = (time) => {
    if (!time) return "Select";
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const mins = m === "30" ? ":30" : ":00";
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}${mins} ${period}`;
  };

  return (
    <div className="form-group" style={{ position: "relative" }}>
      <label>Time Slot *</label>
      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
        <div style={{ flex: 1 }}>
          <button
            type="button"
            onClick={() => setShowPicker(showPicker === "start" ? false : "start")}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "8px",
              border: "1px solid var(--dark-3)",
              background: "var(--dark)",
              color: "white",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            From: {formatTime(startTime)}
          </button>
          {showPicker === "start" && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "var(--dark-2)",
                border: "1px solid var(--dark-3)",
                borderRadius: "8px",
                maxHeight: "200px",
                overflowY: "auto",
                width: "100%",
                zIndex: 1000,
                marginTop: "0.5rem",
              }}
            >
              {hours.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleStartTimeSelect(time)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "none",
                    background: startTime === time ? "var(--gold)" : "transparent",
                    color: startTime === time ? "black" : "white",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatTime(time)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <button
            type="button"
            onClick={() => setShowPicker(showPicker === "end" ? false : "end")}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "8px",
              border: "1px solid var(--dark-3)",
              background: "var(--dark)",
              color: "white",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            To: {formatTime(endTime)}
          </button>
          {showPicker === "end" && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "var(--dark-2)",
                border: "1px solid var(--dark-3)",
                borderRadius: "8px",
                maxHeight: "200px",
                overflowY: "auto",
                width: "100%",
                zIndex: 1000,
                marginTop: "0.5rem",
              }}
            >
              {hours.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleEndTimeSelect(time)}
                  disabled={startTime && time <= startTime}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "none",
                    background:
                      endTime === time
                        ? "var(--gold)"
                        : startTime && time <= startTime
                        ? "var(--dark-3)"
                        : "transparent",
                    color: startTime && time <= startTime ? "#999" : endTime === time ? "black" : "white",
                    cursor: startTime && time <= startTime ? "not-allowed" : "pointer",
                    textAlign: "left",
                    fontSize: "0.85rem",
                  }}
                >
                  {formatTime(time)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {startTime && endTime && (
        <p style={{ color: "var(--gold)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          Duration: {calculateDuration(startTime, endTime)} hours
        </p>
      )}
    </div>
  );
}

function calculateDuration(start, end) {
  if (!start || !end) return 0;
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;
  return ((endMins - startMins) / 60).toFixed(1);
}
