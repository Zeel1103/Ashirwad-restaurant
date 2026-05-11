export default function OrderSection() {
  return (
    <section className="section order-section" id="order">
      <div className="section-header">
        <span className="section-label">Quick &amp; Easy</span>
        <h2 className="section-title">Order Your Way</h2>
        <div className="section-divider"></div>
      </div>
      <div className="order-grid">
        <div className="order-card">
          <div className="icon">📞</div>
          <h3>Call to Order</h3>
          <p>Speak directly with us for personalized ordering and table reservations</p>
          <a href="tel:+918511575440" className="btn-primary">📞 Call 085115 75440</a>
        </div>
        <div className="order-card">
          <div className="icon">💬</div>
          <h3>WhatsApp Order</h3>
          <p>Send your order via WhatsApp for quick confirmation and updates</p>
          <a href="https://wa.me/918511575440?text=Hi!%20I%20would%20like%20to%20place%20an%20order%20from%20Ashirwad%202%20Restaurant" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: "#25D366", color: "white" }}>
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
