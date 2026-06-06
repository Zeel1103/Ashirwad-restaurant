import { neon } from "@neondatabase/serverless";

export function getDb() {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set – running in static mode");
    return null;
  }
  return neon(process.env.DATABASE_URL);
}

export async function initializeDatabase() {
  const sql = getDb();
  if (!sql) return;

  await sql`
    CREATE TABLE IF NOT EXISTS banquet_inquiries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255),
      event_type VARCHAR(100) NOT NULL,
      event_date DATE NOT NULL,
      event_time_start TIME NOT NULL,
      event_time_end TIME NOT NULL,
      booking_type VARCHAR(50) NOT NULL,
      guests INTEGER,
      message TEXT,
      duration_hours DECIMAL(5,2),
      total_amount INTEGER,
      advance_amount INTEGER,
      payment_status VARCHAR(50) DEFAULT 'pending',
      booking_status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price INTEGER,
      category VARCHAR(100) NOT NULL,
      image_url VARCHAR(500),
      is_popular BOOLEAN DEFAULT false,
      is_available BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      rating INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}
