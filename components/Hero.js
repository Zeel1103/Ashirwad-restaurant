export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <img src="/images/hero-food.png" alt="Delicious vegetarian food spread at Ashirwad 2 Restaurant" />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">⭐ Rated 4.5 by 300+ Happy Customers</div>
        <h1 className="hero-title">
          Delicious <span className="highlight">Pure Veg</span> Dining
          <br />Experience in Ankleshwar
        </h1>
        <p className="hero-subtitle">
          Savor authentic Punjabi flavors crafted with love, fresh ingredients, and
          generations of culinary expertise at Ashirwad 2 Restaurant & Banquet.
        </p>
        <div className="hero-ctas">
          <a href="tel:+918511575440" className="btn-primary">🍽️ Order Now</a>
          <a href="#banquet" className="btn-secondary">📅 Book Table</a>
          <a href="#menu" className="btn-secondary">📜 View Menu</a>
        </div>
        <div className="trust-badges">
          <div className="trust-badge"><span className="icon">⭐</span> 4.5 Rating</div>
          <div className="trust-badge"><span className="icon">🧹</span> Hygienic Food</div>
          <div className="trust-badge"><span className="icon">⚡</span> Fast Service</div>
        </div>
      </div>
    </section>
  );
}
