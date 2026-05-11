export default function Reviews() {
  const reviews = [
    { name: "Rajesh Patel", initial: "R", rating: 5, text: "The paneer is incredibly soft and the masala is so rich and flavorful. Best Punjabi food in Ankleshwar without a doubt!", date: "2 weeks ago" },
    { name: "Priya Sharma", initial: "P", rating: 5, text: "Clean and welcoming ambiance. We celebrated our anniversary here and the staff went above and beyond. Truly special experience.", date: "1 month ago" },
    { name: "Amit Desai", initial: "A", rating: 4, text: "Polite and humble service. The Punjabi Thali is a must-try — generous portions and authentic taste. Great value for money!", date: "3 weeks ago" },
    { name: "Meena Gupta", initial: "M", rating: 5, text: "We hosted our son's birthday in the banquet hall. Everything was perfect — from the decoration to the food. Highly recommended!", date: "1 month ago" },
    { name: "Vikram Singh", initial: "V", rating: 5, text: "The jeera rice and dal makhani combo is heavenly. Hygiene standards are top-notch. My family's favorite restaurant.", date: "2 months ago" },
    { name: "Neha Joshi", initial: "N", rating: 4, text: "Fast service, delicious food, and very reasonable prices. The AC section is comfortable. Perfect for family dining!", date: "1 month ago" },
  ];

  return (
    <section className="section reviews-section" id="reviews">
      <div className="section-header">
        <span className="section-label">Testimonials</span>
        <h2 className="section-title">What Our Guests Say</h2>
        <div className="section-divider"></div>
      </div>
      <div className="reviews-grid">
        {reviews.map((r, i) => (
          <div className="review-card" key={i}>
            <span className="review-quote">&ldquo;</span>
            <div className="review-stars">{"⭐".repeat(r.rating)}</div>
            <p className="review-text">&ldquo;{r.text}&rdquo;</p>
            <div className="review-author">
              <div className="review-avatar">{r.initial}</div>
              <div>
                <div className="review-name">{r.name}</div>
                <div className="review-date">{r.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
