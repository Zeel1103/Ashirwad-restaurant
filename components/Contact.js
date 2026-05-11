export default function Contact() {
  return (
    <section className="section" id="contact">
      <div className="section-header">
        <span className="section-label">Find Us</span>
        <h2 className="section-title">Contact & Location</h2>
        <div className="section-divider"></div>
      </div>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-card">
            <div className="contact-icon">📍</div>
            <div>
              <h4>Address</h4>
              <p>Near Railway Station, Opposite Lords Plaza,<br />Ankleshwar GIDC, Gujarat 393001, India</p>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <div>
              <h4>Phone</h4>
              <p><a href="tel:+918511575440">085115 75440</a></p>
              <p style={{ marginTop: "0.3rem" }}>Call for reservations & orders</p>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon">🕐</div>
            <div>
              <h4>Opening Hours</h4>
              <p>Monday – Sunday: 10:00 AM – 11:00 PM</p>
              <p style={{ marginTop: "0.3rem", color: "#25D366" }}>● Open Now</p>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon">🚗</div>
            <div>
              <h4>Services</h4>
              <p>Dine-in • Takeaway • No-contact Delivery</p>
            </div>
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=21.6264,73.0152"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textAlign: "center", justifyContent: "center" }}
          >
            🗺️ Get Directions
          </a>
        </div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.6!2d73.0152!3d21.6264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDM3JzM1LjAiTiA3M8KwMDAnNTQuNyJF!5e0!3m2!1sen!2sin!4v1"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ashirwad 2 Restaurant Location Map"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
