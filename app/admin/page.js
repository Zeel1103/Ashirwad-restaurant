"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user previously logged in during this session
    const authStatus = sessionStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchInquiries();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuth", "true");
        setLoading(true);
        fetchInquiries();
      } else {
        setLoginError(data.error || "Incorrect password");
      }
    } catch (err) {
      setLoginError("Server error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    setPassword("");
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries/list");
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
      } else {
        setError(data.error || "Failed to load inquiries");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // --- LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--dark)", padding: "2rem" }}>
        <div style={{ background: "var(--dark-2)", padding: "3rem", borderRadius: "16px", border: "1px solid var(--dark-3)", width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <h1 style={{ color: "var(--gold)", fontFamily: "'Playfair Display', serif", marginBottom: "0.5rem" }}>Ashirwad 2</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Manager Access Only</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label style={{ color: "var(--cream-light)", marginBottom: "0.5rem", display: "block" }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--dark-3)", background: "var(--dark)", color: "white" }}
                placeholder="Enter admin password"
              />
            </div>
            {loginError && <p style={{ color: "var(--red-accent)", fontSize: "0.85rem", marginTop: "1rem" }}>{loginError}</p>}
            
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Verifying..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  const tableBookings = inquiries.filter(i => i.booking_type === "Table").length;
  const banquetBookings = inquiries.filter(i => i.booking_type === "Banquet").length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--dark)", color: "var(--text-light)" }}>
      {/* Admin Top Bar */}
      <header style={{ background: "var(--dark-2)", padding: "1rem 2rem", borderBottom: "1px solid var(--dark-3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "var(--gold)", fontFamily: "'Playfair Display', serif", margin: 0 }}>Ashirwad 2 Manager</h2>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Secure Dashboard</span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={fetchInquiries} className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>🔄 Refresh</button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderColor: "var(--red-accent)", color: "var(--red-accent)" }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div style={{ background: "var(--dark-2)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--dark-3)" }}>
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Total Inquiries</h3>
            <p style={{ fontSize: "2rem", color: "var(--cream-light)", fontWeight: "bold" }}>{inquiries.length}</p>
          </div>
          <div style={{ background: "var(--dark-2)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--dark-3)" }}>
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Table Bookings</h3>
            <p style={{ fontSize: "2rem", color: "var(--gold)", fontWeight: "bold" }}>{tableBookings}</p>
          </div>
          <div style={{ background: "var(--dark-2)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--dark-3)" }}>
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Banquet Bookings</h3>
            <p style={{ fontSize: "2rem", color: "var(--gold)", fontWeight: "bold" }}>{banquetBookings}</p>
          </div>
        </div>

        <h3 style={{ color: "var(--cream-light)", marginBottom: "1rem", fontSize: "1.5rem" }}>Recent Bookings</h3>

        {loading && <p style={{ color: "var(--text-muted)" }}>Loading inquiries...</p>}
        {error && <p style={{ color: "var(--red-accent)" }}>{error}</p>}

        {!loading && !error && inquiries.length === 0 && (
          <div style={{ background: "var(--dark-2)", padding: "3rem", borderRadius: "16px", textAlign: "center", border: "1px solid var(--dark-3)" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>📝</span>
            <h3 style={{ color: "var(--cream-light)", marginBottom: "0.5rem" }}>No Inquiries Yet</h3>
            <p style={{ color: "var(--text-muted)" }}>When customers book a table or banquet, they will appear here.</p>
          </div>
        )}

        {!loading && inquiries.length > 0 && (
          <div style={{ overflowX: "auto", background: "var(--dark-2)", borderRadius: "12px", border: "1px solid var(--dark-3)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--dark-3)", color: "var(--gold)", textAlign: "left" }}>
                  <th style={{ padding: "1rem" }}>Date Received</th>
                  <th style={{ padding: "1rem" }}>Customer Name</th>
                  <th style={{ padding: "1rem" }}>Contact</th>
                  <th style={{ padding: "1rem" }}>Event Details</th>
                  <th style={{ padding: "1rem" }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id} style={{ borderBottom: "1px solid var(--dark-3)", color: "var(--text-light)" }}>
                    <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                      {formatDate(inq.created_at)}
                    </td>
                    <td style={{ padding: "1rem", fontWeight: "600" }}>
                      {inq.name}
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                      📞 {inq.phone}
                      {inq.email && <><br/>✉️ {inq.email}</>}
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                      <strong style={{ color: "var(--gold-light)" }}>{inq.booking_type} - {inq.event_type.toUpperCase()}</strong>
                      <br/>Date: {formatDate(inq.event_date)}
                      <br/>Time: {inq.event_time}
                      {inq.guests && <><br/>Guests: {inq.guests}</>}
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.9rem", maxWidth: "300px", color: "var(--text-muted)" }}>
                      {inq.message || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
