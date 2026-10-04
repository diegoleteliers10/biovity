import { Result } from "better-result"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { updateUser } from "@/lib/api/users"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"
const AVATAR_PATH_PREFIX = "avatar"

export async function DELETE(_request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = session.user.id

  const admin = Result.try(() => getSupabaseAdmin())
  if (admin.isErr()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
  }
  const supabase = admin.value

  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET)
    .list(AVATAR_PATH_PREFIX, { limit: 100, search: `${userId}.` })

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 })
  }

  const userFiles = files?.filter((f) => f.name.startsWith(`${userId}.`)) ?? []
  if (userFiles.length > 0) {
    const pathsToDelete = userFiles.map((f) => `${AVATAR_PATH_PREFIX}/${f.name}`)
    const { error: deleteError } = await supabase.storage.from(BUCKET).remove(pathsToDelete)
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }
  }

  const result = await updateUser(userId, { avatar: "" }, requestHeaders)
  if (result.isErr()) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
