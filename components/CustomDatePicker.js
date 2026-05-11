"use client";
import { useState } from "react";

export default function CustomDatePicker({ selectedDate, onDateChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Only show current month and future months
  const canGoPrev = false; // Never show previous months

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day) => {
    // Format date string directly to avoid timezone issues
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dateStr = `${year}-${month}-${String(day).padStart(2, "0")}`;
    
    // Check if date is valid (today or future)
    const selected = new Date(dateStr + "T00:00:00");
    if (selected >= today) {
      onDateChange(dateStr);
      setShowPicker(false);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const today = new Date();
    if (prevMonth.getFullYear() > today.getFullYear() || 
        (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() >= today.getMonth())) {
      setCurrentMonth(prevMonth);
    }
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "Select Date";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  };

  const monthName = currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="form-group" style={{ position: "relative" }}>
      <label>Date *</label>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        style={{
          width: "100%",
          padding: "0.8rem",
          borderRadius: "8px",
          border: "1px solid var(--dark-3)",
          background: "var(--dark)",
          color: "white",
          cursor: "pointer",
          fontSize: "0.9rem",
          marginTop: "0.5rem",
        }}
      >
        📅 {formatDisplayDate(selectedDate)}
      </button>

      {showPicker && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "var(--dark-2)",
            border: "1px solid var(--dark-3)",
            borderRadius: "8px",
            padding: "1rem",
            width: "320px",
            zIndex: 1000,
            marginTop: "0.5rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {/* Month Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--gold)",
                cursor: canGoPrev ? "pointer" : "not-allowed",
                fontSize: "1.2rem",
                opacity: canGoPrev ? 1 : 0.3,
              }}
            >
              ← Prev
            </button>
            <span style={{ color: "white", fontWeight: "bold" }}>{monthName}</span>
            <button
              type="button"
              onClick={handleNextMonth}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--gold)",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            >
              Next →
            </button>
          </div>

          {/* Weekday Headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", marginBottom: "0.5rem" }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: "bold" }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem" }}>
            {days.map((day, idx) => {
              let isDisabled = false;
              let isSelected = false;
              let cellDateStr = null;
              
              if (day) {
                const year = currentMonth.getFullYear();
                const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
                cellDateStr = `${year}-${month}-${String(day).padStart(2, "0")}`;
                const cellDate = new Date(cellDateStr + "T00:00:00");
                isDisabled = cellDate < today;
                isSelected = selectedDate === cellDateStr;
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => day && !isDisabled && handleDateClick(day)}
                  disabled={!day || isDisabled}
                  style={{
                    padding: "0.6rem",
                    border: "1px solid var(--dark-3)",
                    borderRadius: "4px",
                    background: isSelected ? "var(--gold)" : isDisabled ? "var(--dark-3)" : "transparent",
                    color: isSelected ? "black" : isDisabled ? "#666" : "white",
                    cursor: !day || isDisabled ? "not-allowed" : "pointer",
                    fontSize: "0.85rem",
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
