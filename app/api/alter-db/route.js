import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = getDb();
    if (!sql) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });

    // Clear the menu_items table
    await sql`TRUNCATE TABLE menu_items RESTART IDENTITY CASCADE`;

    return NextResponse.json({ success: true, message: "Menu items cleared successfully!" });
  } catch (error) {
    console.error("DB alter error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
