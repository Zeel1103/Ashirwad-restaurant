import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

const menuItems = [
  { name: "Paneer Kadai", description: "Soft paneer in rich tomato-capsicum gravy with kadai masala", price: 280, category: "Punjabi Main Course", image_url: "/images/paneer-kadai.png", is_popular: true },
  { name: "Paneer Butter Masala", description: "Creamy, buttery tomato curry with tender paneer cubes", price: 290, category: "Punjabi Main Course", image_url: "/images/paneer-butter-masala.png", is_popular: true },
  { name: "Dal Makhani", description: "Slow-cooked black lentils in rich buttery cream sauce", price: 220, category: "Punjabi Main Course", image_url: "/images/dal-makhani.png", is_popular: false },
  { name: "Malai Kofta", description: "Velvety paneer-potato dumplings in creamy cashew gravy", price: 270, category: "Punjabi Main Course", image_url: "/images/malai-kofta.png", is_popular: false },
  { name: "Mixed Veg Curry", description: "Seasonal vegetables in aromatic North Indian spice blend", price: 200, category: "Punjabi Main Course", image_url: "/images/mixed-veg.png", is_popular: false },
  { name: "Chole Bhature", description: "Spicy chickpea curry served with fluffy fried bread", price: 180, category: "Punjabi Main Course", image_url: "/images/chole-bhature.png", is_popular: true },
  { name: "Punjabi Thali", description: "Complete meal: 2 curries, dal, rice, roti, papad, sweet, salad", price: 350, category: "Thali", image_url: "/images/punjabi-thali.png", is_popular: true },
  { name: "Gujarati Thali", description: "Traditional Gujarati spread with dal, kadhi, sabzi, rotli, rice", price: 300, category: "Thali", image_url: "/images/gujarati-thali.png", is_popular: false },
  { name: "Special Thali", description: "Premium thali with paneer, dal makhani, naan, dessert & more", price: 400, category: "Thali", image_url: "/images/special-thali.png", is_popular: true },
  { name: "Jeera Rice", description: "Fragrant basmati rice tempered with cumin seeds and ghee", price: 150, category: "Rice & Breads", image_url: "/images/jeera-rice.png", is_popular: true },
  { name: "Veg Biryani", description: "Aromatic layered basmati with seasonal vegetables and spices", price: 220, category: "Rice & Breads", image_url: "/images/veg-biryani.png", is_popular: false },
  { name: "Butter Naan", description: "Soft clay-oven baked bread brushed with melted butter", price: 60, category: "Rice & Breads", image_url: "/images/naan.png", is_popular: false },
  { name: "Garlic Naan", description: "Naan topped with garlic, herbs and butter", price: 70, category: "Rice & Breads", image_url: "/images/garlic-naan.png", is_popular: false },
  { name: "Laccha Paratha", description: "Flaky layered whole wheat bread, crisp and golden", price: 60, category: "Rice & Breads", image_url: "/images/laccha-paratha.png", is_popular: false },
  { name: "Masala Chaas", description: "Refreshing spiced buttermilk with cumin and fresh herbs", price: 50, category: "Beverages", image_url: "/images/masala-chaas.png", is_popular: false },
  { name: "Fresh Lime Soda", description: "Zesty lime with soda, sweet or salted to your taste", price: 60, category: "Beverages", image_url: "/images/fresh-lime-soda.png", is_popular: false },
  { name: "Mango Lassi", description: "Creamy yogurt blended with sweet Alphonso mango pulp", price: 90, category: "Beverages", image_url: "/images/mango-lassi.png", is_popular: true },
  { name: "Masala Tea", description: "Traditional Indian chai with aromatic spices", price: 30, category: "Beverages", image_url: "/images/masala-tea.png", is_popular: false },
];

export async function GET() {
  try {
    const sql = getDb();
    if (!sql) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });

    // Check if already seeded
    const existing = await sql`SELECT COUNT(*) as count FROM menu_items`;
    if (parseInt(existing[0].count) > 0) {
      return NextResponse.json({ message: "Menu already seeded", count: existing[0].count });
    }

    for (const item of menuItems) {
      await sql`
        INSERT INTO menu_items (name, description, price, category, image_url, is_popular)
        VALUES (${item.name}, ${item.description}, ${item.price}, ${item.category}, ${item.image_url}, ${item.is_popular})
      `;
    }

    return NextResponse.json({ success: true, message: `Seeded ${menuItems.length} menu items!` });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
