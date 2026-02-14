import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Simple ping query to keep Supabase database alive
    await pool.query("SELECT 1");

    await pool.end();

    return NextResponse.json({
      success: true,
      message: "Database ping successful",
    });
  } catch (error) {
    console.error("Database ping failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database ping failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
