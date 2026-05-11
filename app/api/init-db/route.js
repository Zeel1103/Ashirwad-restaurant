import { getDb, initializeDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: "Database tables created successfully!" });
  } catch (error) {
    console.error("DB init error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
