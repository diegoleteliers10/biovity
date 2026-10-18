import { NextResponse } from "next/server"

export async function DELETE() {
  return NextResponse.json(
    { error: "Las consultas de contacto no se pueden borrar" },
    { status: 405 }
  )
}
