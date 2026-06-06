import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = getDb();
    if (!sql) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });

    // Alter the table to make price nullable
    await sql`ALTER TABLE menu_items ALTER COLUMN price DROP NOT NULL`;
    
    // Truncate the table to start clean, since we'll auto-seed with all 200+ items
    await sql`TRUNCATE TABLE menu_items RESTART IDENTITY CASCADE`;

    return NextResponse.json({ 
      success: true, 
      message: "Database schema updated (price is now nullable) and menu cleared successfully!" 
    });
  } catch (error) {
    console.error("DB alter error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
