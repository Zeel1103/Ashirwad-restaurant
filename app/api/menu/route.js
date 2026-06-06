import { getDb } from "@/lib/db";
import { defaultMenu } from "@/lib/defaultMenu";
import { NextResponse } from "next/server";

// GET /api/menu - Fetch all menu items, auto-seeds from defaultMenu if empty
export async function GET() {
  try {
    const sql = getDb();
    if (!sql) {
      // Return local menu items if DB is not configured
      console.warn("DATABASE_URL not set, returning fallback local menu data.");
      return NextResponse.json({ success: true, menuItems: flattenDefaultMenu(), fallback: true });
    }

    // Check if table is empty
    let countRes = await sql`SELECT COUNT(*)::integer as count FROM menu_items`;
    let count = countRes[0]?.count || 0;

    if (count === 0) {
      console.log("Database menu_items table is empty. Seeding with 200+ default menu items...");
      
      // Bulk seed default menu
      for (const [category, items] of Object.entries(defaultMenu)) {
        for (const item of items) {
          const desc = item.desc || null;
          const price = item.price !== undefined ? item.price : null;
          const img = item.img || null;
          const popular = !!item.popular;
          const available = true;

          await sql`
            INSERT INTO menu_items (name, description, price, category, image_url, is_popular, is_available)
            VALUES (${item.name}, ${desc}, ${price}, ${category}, ${img}, ${popular}, ${available})
          `;
        }
      }
      console.log("Seeding complete!");
    }

    // Fetch all items sorted by id (preserves insertion order which matches original menu grouping)
    const items = await sql`
      SELECT * FROM menu_items ORDER BY id ASC
    `;

    return NextResponse.json({ success: true, menuItems: items });
  } catch (error) {
    console.error("Fetch menu items error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/menu - Add a new menu item
export async function POST(request) {
  try {
    // Basic authorization check
    const authHeader = request.headers.get("Authorization");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized - Invalid Password" }, { status: 401 });
    }

    const { name, description, price, category, image_url, is_popular, is_available } = await request.json();

    if (!name || !category) {
      return NextResponse.json({ error: "Name and Category are required" }, { status: 400 });
    }

    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const parsedPrice = price !== "" && price !== null && price !== undefined ? parseInt(price) : null;
    const popular = !!is_popular;
    const available = is_available !== undefined ? !!is_available : true;

    const result = await sql`
      INSERT INTO menu_items (name, description, price, category, image_url, is_popular, is_available)
      VALUES (${name}, ${description || null}, ${parsedPrice}, ${category}, ${image_url || null}, ${popular}, ${available})
      RETURNING *
    `;

    return NextResponse.json({ success: true, menuItem: result[0] });
  } catch (error) {
    console.error("Add menu item error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper to flatten defaultMenu into a database-compatible array format (for static mode)
function flattenDefaultMenu() {
  const list = [];
  let idCounter = 1;
  for (const [category, items] of Object.entries(defaultMenu)) {
    for (const item of items) {
      list.push({
        id: idCounter++,
        name: item.name,
        description: item.desc || null,
        price: item.price !== undefined ? item.price : null,
        category: category,
        image_url: item.img || null,
        is_popular: !!item.popular,
        is_available: true,
      });
    }
  }
  return list;
}
