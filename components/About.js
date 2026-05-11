export default function About() {
  return (
    <section className="section" id="about">
      <div className="section-header">
        <span className="section-label">Our Story</span>
        <h2 className="section-title">Welcome to Ashirwad 2</h2>
        <div className="section-divider"></div>
      </div>
      <div className="about-grid">
        <div className="about-image">
          <img src="/images/restaurant-interior.png" alt="Ashirwad 2 Restaurant elegant interior with warm ambient lighting" />
        </div>
        <div className="about-text">
          <p>
            At <strong>Ashirwad 2 Restaurant & Banquet</strong>, we believe every meal should
            be a celebration. Nestled in the heart of Ankleshwar, our restaurant brings together
            the rich traditions of Punjabi cuisine with a commitment to purity, hygiene, and
            heartfelt hospitality.
          </p>
          <p>
            From our signature Paneer Kadai to our beloved Punjabi Thali, every dish is
            crafted with the freshest ingredients and authentic spices. Whether you&apos;re
            dining with family in our comfortable AC section or hosting a grand celebration
            in our banquet hall, we ensure an experience that lingers in your memory.
          </p>
          <div className="about-features">
            <div className="about-feature">
              <span className="icon">❄️</span>
              <span>AC & Non-AC Seating</span>
            </div>
            <div className="about-feature">
              <span className="icon">👨‍👩‍👧‍👦</span>
              <span>Family Friendly</span>
            </div>
            <div className="about-feature">
              <span className="icon">🏛️</span>
              <span>Banquet Hall</span>
            </div>
            <div className="about-feature">
              <span className="icon">🌿</span>
              <span>Pure Vegetarian</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
