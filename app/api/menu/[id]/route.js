import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH /api/menu/[id] - Update a specific menu item
export async function PATCH(request, { params }) {
  try {
    // Basic authorization check
    const authHeader = request.headers.get("Authorization");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized - Invalid Password" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, price, category, image_url, is_popular, is_available } = body;

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
      UPDATE menu_items 
      SET 
        name = ${name}, 
        description = ${description || null}, 
        price = ${parsedPrice}, 
        category = ${category}, 
        image_url = ${image_url || null}, 
        is_popular = ${popular}, 
        is_available = ${available}
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, menuItem: result[0] });
  } catch (error) {
    console.error("Update menu item error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/menu/[id] - Delete a specific menu item
export async function DELETE(request, { params }) {
  try {
    // Basic authorization check
    const authHeader = request.headers.get("Authorization");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized - Invalid Password" }, { status: 401 });
    }

    const { id } = await params;
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const result = await sql`
      DELETE FROM menu_items
      WHERE id = ${parseInt(id)}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Menu item deleted successfully", menuItem: result[0] });
  } catch (error) {
    console.error("Delete menu item error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
