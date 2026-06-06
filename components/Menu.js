"use client";
import { useState, useEffect } from "react";

const DEFAULT_CATEGORY_ORDER = [
  "Punjabi Main Course", "Thali", "Rice & Breads", "Beverages", "Paneer Ki Sabziya",
  "Indian Veg.", "Kaju & Kofta", "Kathiyawadi", "Hari Bhari Sabziya", "Dal",
  "Roti / Bread", "Rice", "South Indian", "Sp. Cheese Main Course", "Salad / Raita",
  "Papad", "Kuch Mitha Ho Jaye", "Ice Cream", "Milk Shake & Juice", "Hot & Cold Drinks"
];

export default function Menu() {
  const [menuData, setMenuData] = useState({});
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();
        if (data.success) {
          const grouped = {};
          
          // Group items by category, only showing available ones
          const availableItems = data.menuItems.filter(item => item.is_available);
          
          availableItems.forEach(item => {
            if (!grouped[item.category]) {
              grouped[item.category] = [];
            }
            grouped[item.category].push({
              id: item.id,
              name: item.name,
              desc: item.description,
              price: item.price,
              popular: item.is_popular,
              img: item.image_url
            });
          });

          const loadedCategories = Object.keys(grouped);
          loadedCategories.sort((a, b) => {
            const indexA = DEFAULT_CATEGORY_ORDER.indexOf(a);
            const indexB = DEFAULT_CATEGORY_ORDER.indexOf(b);
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1; // new categories go to the end
            if (indexB === -1) return -1;
            return indexA - indexB;
          });

          setMenuData(grouped);
          setCategories(loadedCategories);
          if (loadedCategories.length > 0) {
            setActive(loadedCategories[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const toggleCategory = (cat) => {
    if (active === cat) {
      setActive(null);
    } else {
      setActive(cat);
    }
  };

  if (loading) {
    return (
      <section className="menu-section" id="menu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div className="section-header">
          <span className="section-label">Our Menu</span>
          <h2 className="section-title">Savor Every Bite</h2>
          <div className="section-divider"></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3rem' }}>
          <div className="menu-spinner"></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', letterSpacing: '1px' }}>Preparing the fresh menu...</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .menu-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(212, 175, 55, 0.1);
            border-top: 3px solid var(--gold);
            border-radius: 50%;
            animation: spin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </section>
    );
  }

  return (
    <section className="menu-section" id="menu">
      <div className="section-header">
        <span className="section-label">Our Menu</span>
        <h2 className="section-title">Savor Every Bite</h2>
        <div className="section-divider"></div>
      </div>
      <div className="menu-accordion">
        {categories.map((cat) => (
          <div key={cat} className={`accordion-item ${active === cat ? "open" : ""}`}>
            <button className="accordion-header" onClick={() => toggleCategory(cat)}>
              <h3>{cat}</h3>
              <span className="accordion-icon">▼</span>
            </button>
            <div className="accordion-content">
              <div className="menu-grid">
                {menuData[cat].map((item) => (
                  <div className="menu-card" key={item.id} style={{ minHeight: item.img ? 'auto' : '100px' }}>
                    {item.img && (
                      <div className="menu-card-img">
                        <img src={item.img} alt={item.name} />
                      </div>
                    )}
                    <div className="menu-card-body" style={{ padding: item.img ? '1.5rem' : '1.5rem 1.5rem 1rem 1.5rem' }}>
                      <h3>{item.name}</h3>
                      {item.desc && <p>{item.desc}</p>}
                      <div className="menu-card-footer" style={{ marginTop: item.desc ? '0' : '1rem' }}>
                        {item.price !== null && item.price !== undefined && <span className="menu-price">₹{item.price}</span>}
                        {item.popular && <span className="menu-badge">🔥 Popular</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="specials-banner">
        <h3>🎉 Weekend Family Combo</h3>
        <p>2 Thalis + 2 Beverages + 1 Dessert — Special price for families every Saturday & Sunday!</p>
        <a href="tel:+918511575440" className="btn-primary">Call to Reserve</a>
      </div>
    </section>
  );
}
