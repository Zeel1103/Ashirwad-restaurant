export default function Gallery() {
  const images = [
    { src: "/images/hero-food.png", label: "Our Signature Spread" },
    { src: "/images/restaurant-interior.png", label: "Elegant Dining Area" },
    { src: "/images/paneer-kadai.png", label: "Paneer Kadai Special" },
    { src: "/images/banquet-hall.png", label: "Grand Banquet Hall" },
    { src: "/images/punjabi-thali.png", label: "Punjabi Thali" },
    { src: "/images/dining-setup.png", label: "Fine Dining Setup" },
  ];

  return (
    <section className="section" id="gallery">
      <div className="section-header">
        <span className="section-label">Visual Journey</span>
        <h2 className="section-title">Our Gallery</h2>
        <div className="section-divider"></div>
      </div>
      <div className="gallery-grid">
        {images.map((img, i) => (
          <div className="gallery-item" key={i}>
            <img src={img.src} alt={img.label} />
            <div className="gallery-item-overlay">
              <span>{img.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
