import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = getDb();
    if (!sql) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });

    const inquiries = await sql`
      SELECT * FROM banquet_inquiries ORDER BY created_at DESC
    `;

    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error("Fetch inquiries error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
