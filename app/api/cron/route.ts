import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    // Simple ping query to keep database alive (uses shared pool, no create/destroy)
    await pool.query("SELECT 1")

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
