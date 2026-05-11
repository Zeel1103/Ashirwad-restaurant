import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    // Uses the password from .env.local, or defaults to "admin123" if not set
    const correctPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Incorrect password" }, 
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
