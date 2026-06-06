"use client";
import { useState, useEffect } from "react";

const DEFAULT_CATEGORY_ORDER = [
  "Punjabi Main Course", "Thali", "Rice & Breads", "Beverages", "Paneer Ki Sabziya",
  "Indian Veg.", "Kaju & Kofta", "Kathiyawadi", "Hari Bhari Sabziya", "Dal",
  "Roti / Bread", "Rice", "South Indian", "Sp. Cheese Main Course", "Salad / Raita",
  "Papad", "Kuch Mitha Ho Jaye", "Ice Cream", "Milk Shake & Juice", "Hot & Cold Drinks"
];

export default function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab State: "bookings" or "menu"
  const [activeTab, setActiveTab] = useState("bookings");

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Menu State
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingPrices, setEditingPrices] = useState({}); // { itemId: StringPrice }
  const [updatingId, setUpdatingId] = useState(null);

  // New Menu Item Form State
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Punjabi Main Course",
    customCategory: "",
    price: "",
    description: "",
    image_url: "",
    is_popular: false,
    is_available: true
  });
  const [addingItem, setAddingItem] = useState(false);

  // Load Auth Status & Initial Data
  useEffect(() => {
    const authStatus = sessionStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchInquiries();
      fetchMenu();
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
        sessionStorage.setItem("adminPassword", password); // Store for API route auth
        setLoading(true);
        fetchInquiries();
        fetchMenu();
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
    sessionStorage.removeItem("adminPassword");
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

  const fetchMenu = async () => {
    setMenuLoading(true);
    setMenuError("");
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.menuItems);
        // Expand the first category by default
        if (data.menuItems.length > 0) {
          const firstCat = data.menuItems[0].category;
          setExpandedCategories({ [firstCat]: true });
        }
      } else {
        setMenuError(data.error || "Failed to load menu items");
      }
    } catch (err) {
      setMenuError("Error fetching menu items");
    } finally {
      setMenuLoading(false);
    }
  };

  // Update a field on a menu item (e.g. price, is_available, is_popular)
  const handleUpdateItem = async (id, updatedFields) => {
    setUpdatingId(id);
    try {
      const savedPassword = sessionStorage.getItem("adminPassword") || "";
      const currentItem = menuItems.find(item => item.id === id);
      const payload = { ...currentItem, ...updatedFields };

      const res = await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedPassword}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setMenuItems(menuItems.map(item => item.id === id ? data.menuItem : item));
        // Clear editing state for price if it was a price update
        if (updatedFields.price !== undefined) {
          setEditingPrices(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }
      } else {
        alert(data.error || "Failed to update item");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating item");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete a menu item
  const handleDeleteItem = async (id, name) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      return;
    }
    try {
      const savedPassword = sessionStorage.getItem("adminPassword") || "";
      const res = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${savedPassword}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setMenuItems(menuItems.filter(item => item.id !== id));
      } else {
        alert(data.error || "Failed to delete item");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting item");
    }
  };

  // Add a new menu item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setAddingItem(true);

    const category = newItem.category === "custom" ? newItem.customCategory : newItem.category;

    if (!category) {
      alert("Please specify a category");
      setAddingItem(false);
      return;
    }

    try {
      const savedPassword = sessionStorage.getItem("adminPassword") || "";
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedPassword}`
        },
        body: JSON.stringify({
          name: newItem.name,
          category: category,
          price: newItem.price === "" ? null : parseInt(newItem.price),
          description: newItem.description,
          image_url: newItem.image_url,
          is_popular: newItem.is_popular,
          is_available: newItem.is_available
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setMenuItems([...menuItems, data.menuItem]);
        // Expand the category we just added to
        setExpandedCategories(prev => ({ ...prev, [category]: true }));
        // Reset form except category
        setNewItem({
          name: "",
          category: newItem.category,
          customCategory: newItem.customCategory,
          price: "",
          description: "",
          image_url: "",
          is_popular: false,
          is_available: true
        });
        alert("Dish added successfully!");
      } else {
        alert(data.error || "Failed to add dish");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding dish");
    } finally {
      setAddingItem(false);
    }
  };

  const toggleCategoryExpand = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
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

  // Group items by category for the Menu Manager list
  const menuByCategory = {};
  menuItems.forEach(item => {
    if (!menuByCategory[item.category]) {
      menuByCategory[item.category] = [];
    }
    menuByCategory[item.category].push(item);
  });

  const uniqueCategories = Object.keys(menuByCategory).sort((a, b) => {
    const indexA = DEFAULT_CATEGORY_ORDER.indexOf(a);
    const indexB = DEFAULT_CATEGORY_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Calculate Bookings Stats
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
          <button 
            onClick={activeTab === "bookings" ? fetchInquiries : fetchMenu} 
            className="btn-secondary" 
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            🔄 Refresh
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderColor: "var(--red-accent)", color: "var(--red-accent)" }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--dark-3)', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab("bookings")}
            style={{
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'bookings' ? '2px solid var(--gold)' : '2px solid transparent',
              color: activeTab === 'bookings' ? 'var(--gold)' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            📋 Bookings ({inquiries.length})
          </button>
          <button 
            onClick={() => setActiveTab("menu")}
            style={{
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'menu' ? '2px solid var(--gold)' : '2px solid transparent',
              color: activeTab === 'menu' ? 'var(--gold)' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            🍽️ Manage Menu ({menuItems.length})
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: BOOKINGS & INQUIRIES VIEW */}
        {/* ============================================================ */}
        {activeTab === "bookings" && (
          <div>
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
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: MENU MANAGER VIEW */}
        {/* ============================================================ */}
        {activeTab === "menu" && (
          <div>
            {/* Split layout: Add Form + Accordions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'start' }}>
              
              {/* Left Column: List & Categories Accordion */}
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ color: "var(--cream-light)", fontSize: "1.5rem", margin: 0 }}>Active Menu Categories</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click to expand/collapse and manage dishes</span>
                </div>

                {menuLoading && <p style={{ color: "var(--text-muted)" }}>Loading menu items...</p>}
                {menuError && <p style={{ color: "var(--red-accent)" }}>{menuError}</p>}

                {!menuLoading && uniqueCategories.length === 0 && (
                  <div style={{ background: 'var(--dark-2)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--dark-3)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No dishes found in menu database.</p>
                  </div>
                )}

                {!menuLoading && uniqueCategories.map(cat => {
                  const items = menuByCategory[cat];
                  const isOpen = !!expandedCategories[cat];
                  return (
                    <div key={cat} style={{ background: 'var(--dark-2)', borderRadius: '12px', border: '1px solid var(--dark-3)', marginBottom: '1rem', overflow: 'hidden' }}>
                      {/* Accordion Header */}
                      <button 
                        onClick={() => toggleCategoryExpand(cat)}
                        style={{
                          width: '100%',
                          background: 'var(--dark-3)',
                          border: 'none',
                          padding: '1.2rem 1.5rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          color: 'var(--gold)',
                          textAlign: 'left'
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          📁 {cat} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'normal' }}>({items.length} dishes)</span>
                        </h4>
                        <span style={{ fontSize: '0.8rem', transition: 'all 0.3s' }}>
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </button>

                      {/* Accordion Content */}
                      {isOpen && (
                        <div style={{ padding: '1rem', overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                              <tr style={{ color: 'var(--cream-light)', borderBottom: '2px solid var(--dark-3)', fontSize: '0.85rem', textAlign: 'left' }}>
                                <th style={{ padding: '0.8rem 0.5rem' }}>Name</th>
                                <th style={{ padding: '0.8rem 0.5rem', width: '150px' }}>Price (₹)</th>
                                <th style={{ padding: '0.8rem 0.5rem', textAlign: 'center', width: '90px' }}>Available</th>
                                <th style={{ padding: '0.8rem 0.5rem', textAlign: 'center', width: '90px' }}>Popular</th>
                                <th style={{ padding: '0.8rem 0.5rem', textAlign: 'center', width: '80px' }}>Remove</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map(item => {
                                const localPrice = editingPrices[item.id] !== undefined 
                                  ? editingPrices[item.id] 
                                  : (item.price === null ? "" : String(item.price));
                                  
                                const isPriceChanged = editingPrices[item.id] !== undefined && 
                                  editingPrices[item.id] !== (item.price === null ? "" : String(item.price));

                                return (
                                  <tr key={item.id} style={{ borderBottom: '1px solid var(--dark-3)', fontSize: '0.9rem', color: item.is_available ? 'white' : 'var(--text-muted)' }}>
                                    
                                    {/* Name and description */}
                                    <td style={{ padding: '0.8rem 0.5rem' }}>
                                      <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {item.name} 
                                        {item.is_popular && <span style={{ fontSize: '0.75rem', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>🔥 Popular</span>}
                                        {!item.is_available && <span style={{ fontSize: '0.75rem', background: '#3a1f1f', color: '#ff6b6b', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Hidden</span>}
                                      </div>
                                      {item.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', maxWidth: '280px' }}>{item.description}</div>}
                                    </td>

                                    {/* Price Input & Save */}
                                    <td style={{ padding: '0.8rem 0.5rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <input 
                                          type="text" 
                                          value={localPrice}
                                          onChange={(e) => setEditingPrices({ ...editingPrices, [item.id]: e.target.value })}
                                          placeholder="No Price"
                                          style={{
                                            width: '70px',
                                            padding: '0.4rem',
                                            borderRadius: '6px',
                                            border: '1px solid var(--dark-3)',
                                            background: 'var(--dark)',
                                            color: 'white',
                                            fontSize: '0.85rem'
                                          }}
                                        />
                                        {isPriceChanged && (
                                          <button
                                            onClick={() => handleUpdateItem(item.id, { price: localPrice === "" ? null : parseInt(localPrice) })}
                                            disabled={updatingId === item.id}
                                            style={{
                                              padding: '0.4rem 0.6rem',
                                              background: 'var(--gold)',
                                              border: 'none',
                                              borderRadius: '6px',
                                              color: 'var(--dark)',
                                              cursor: 'pointer',
                                              fontSize: '0.75rem',
                                              fontWeight: 'bold'
                                            }}
                                          >
                                            {updatingId === item.id ? "..." : "Save"}
                                          </button>
                                        )}
                                      </div>
                                    </td>

                                    {/* Available Switch */}
                                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center' }}>
                                      <input 
                                        type="checkbox"
                                        checked={!!item.is_available}
                                        onChange={() => handleUpdateItem(item.id, { is_available: !item.is_available })}
                                        disabled={updatingId === item.id}
                                        style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: 'var(--gold)' }}
                                      />
                                    </td>

                                    {/* Popular Switch */}
                                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center' }}>
                                      <input 
                                        type="checkbox"
                                        checked={!!item.is_popular}
                                        onChange={() => handleUpdateItem(item.id, { is_popular: !item.is_popular })}
                                        disabled={updatingId === item.id}
                                        style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: 'var(--gold)' }}
                                      />
                                    </td>

                                    {/* Remove Button */}
                                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center' }}>
                                      <button 
                                        onClick={() => handleDeleteItem(item.id, item.name)}
                                        style={{
                                          background: 'transparent',
                                          border: 'none',
                                          color: 'var(--red-accent)',
                                          cursor: 'pointer',
                                          fontSize: '1.1rem',
                                          padding: '0.2rem 0.5rem'
                                        }}
                                        title="Delete Dish"
                                      >
                                        🗑️
                                      </button>
                                    </td>

                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Add New Dish Form */}
              <div>
                <div style={{ background: 'var(--dark-2)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--dark-3)', position: 'sticky', top: '2rem' }}>
                  <h3 style={{ color: 'var(--gold)', fontFamily: "'Playfair Display', serif", margin: '0 0 1.5rem 0', fontSize: '1.3rem', borderBottom: '1px solid var(--dark-3)', paddingBottom: '0.5rem' }}>
                    🍽️ Add New Dish
                  </h3>

                  <form onSubmit={handleAddItem}>
                    {/* Name */}
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                      <label style={{ display: 'block', color: 'var(--cream-light)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Dish Name *</label>
                      <input 
                        type="text" 
                        required
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="e.g. Kaju Butter Masala"
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--dark-3)', background: 'var(--dark)', color: 'white', fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* Category Selection */}
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                      <label style={{ display: 'block', color: 'var(--cream-light)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Category *</label>
                      <select 
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--dark-3)', background: 'var(--dark)', color: 'white', fontSize: '0.9rem' }}
                      >
                        {DEFAULT_CATEGORY_ORDER.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="custom">+ Create Custom Category...</option>
                      </select>
                    </div>

                    {/* Custom Category Input */}
                    {newItem.category === "custom" && (
                      <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', color: 'var(--gold)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Custom Category Name *</label>
                        <input 
                          type="text" 
                          required
                          value={newItem.customCategory}
                          onChange={(e) => setNewItem({ ...newItem, customCategory: e.target.value })}
                          placeholder="e.g. Chinese Starters"
                          style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--dark-3)', background: 'var(--dark)', color: 'white', fontSize: '0.9rem' }}
                        />
                      </div>
                    )}

                    {/* Price & Popularity Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                      <div className="form-group">
                        <label style={{ display: 'block', color: 'var(--cream-light)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Price (₹)</label>
                        <input 
                          type="number" 
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                          placeholder="e.g. 150 (Leave blank if none)"
                          style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--dark-3)', background: 'var(--dark)', color: 'white', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--cream-light)', fontSize: '0.85rem', cursor: 'pointer', marginTop: '1.5rem' }}>
                          <input 
                            type="checkbox"
                            checked={newItem.is_popular}
                            onChange={(e) => setNewItem({ ...newItem, is_popular: e.target.checked })}
                            style={{ width: '17px', height: '17px', accentColor: 'var(--gold)' }}
                          />
                          🔥 Popular Item
                        </label>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                      <label style={{ display: 'block', color: 'var(--cream-light)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Description (Optional)</label>
                      <textarea 
                        rows={2}
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Briefly describe the ingredients or taste..."
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--dark-3)', background: 'var(--dark)', color: 'white', fontSize: '0.9rem', resize: 'vertical' }}
                      />
                    </div>

                    {/* Image URL */}
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', color: 'var(--cream-light)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>Image URL (Optional)</label>
                      <input 
                        type="text" 
                        value={newItem.image_url}
                        onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                        placeholder="e.g. /images/chole-bhature.png"
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--dark-3)', background: 'var(--dark)', color: 'white', fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
                      disabled={addingItem}
                    >
                      {addingItem ? "Adding Dish..." : "➕ Add to Menu"}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
