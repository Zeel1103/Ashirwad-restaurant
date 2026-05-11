export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Ashirwad 2</h3>
          <p>
            Premium pure vegetarian restaurant & banquet hall in Ankleshwar.
            Serving authentic Punjabi flavors with love and hygiene since day one.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#banquet">Banquet</a></li>
            <li><a href="#gallery">Gallery</a></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="#order">Dine-in</a></li>
            <li><a href="#order">Takeaway</a></li>
            <li><a href="#order">Delivery</a></li>
            <li><a href="#banquet">Banquet Booking</a></li>
            <li><a href="#contact">Reservations</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:+918511575440">085115 75440</a></li>
            <li><a href="https://wa.me/918511575440" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href="#contact">Near Railway Station</a></li>
            <li><a href="#contact">Ankleshwar, Gujarat</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <p style={{ margin: 0 }}>© 2026 Ashirwad 2 Restaurant & Banquet. All rights reserved. | Best Veg Restaurant in Ankleshwar</p>
        <a href="/admin" className="admin-link" style={{ color: "var(--text-muted)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.3s" }}>Manager Login</a>
      </div>
    </footer>
  );
}
