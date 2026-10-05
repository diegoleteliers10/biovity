// @env node
import { Result, TaggedError } from "better-result"
import { getDocumentProxy } from "unpdf"
import type { Resume } from "@/lib/api/resumes"
import { getSupabaseAdmin } from "@/lib/supabase"
import { JEV_MAX_CV_TEXT_LENGTH } from "./constants"

export class CandidateCvError extends TaggedError("CandidateCvError")<{
  message: string
  reason: "path" | "download" | "invalid_pdf" | "limits" | "no_text" | "cleanup"
  cause?: unknown
}>() {}

function cvError(reason: CandidateCvError["reason"], message: string, cause?: unknown): Error {
  return new CandidateCvError({ reason, message, cause })
}

function validateCvPath(resume: Resume): Result<string, Error> {
  const path = resume.cvFile?.path
  if (
    !path ||
    !resume.userId ||
    !/^cv\/[a-z0-9._-]+\.pdf$/i.test(path) ||
    !path.toLowerCase().endsWith(`_${resume.userId.toLowerCase()}.pdf`) ||
    path.length <= `cv/_${resume.userId}.pdf`.length
  ) {
    return Result.err(
      cvError("path", "The CV path does not match its candidate. Upload the CV again.")
    )
  }
  return Result.ok(path)
}

async function extractCvText(blob: Blob): Promise<Result<string, Error>> {
  if (blob.size === 0 || blob.size > 10 * 1024 * 1024) {
    return Result.err(cvError("limits", "The CV must contain a PDF of 10 MiB or less."))
  }
  const documentResult = (
    await Result.tryPromise(async () => {
      const bytes = new Uint8Array(await blob.arrayBuffer())
      return getDocumentProxy(bytes, { maxImageSize: 16_777_216 })
    })
  ).mapError((cause) =>
    cvError("invalid_pdf", "The CV PDF could not be read. Upload a valid PDF.", cause)
  )
  if (documentResult.isErr()) return Result.err(documentResult.error)
  const document = documentResult.value
  const textResult =
    document.numPages > 30
      ? Result.err<string, Error>(cvError("limits", "The CV exceeds the limit of 30 pages."))
      : (
          await Result.tryPromise(async () => {
            let text = ""
            for (
              let number = 1;
              number <= document.numPages && text.length < JEV_MAX_CV_TEXT_LENGTH;
              number++
            ) {
              const page = await document.getPage(number)
              const content = await page.getTextContent()
              for (const item of content.items) {
                if ("str" in item) {
                  text += `${item.str}${item.hasEOL ? "\n" : " "}`.slice(
                    0,
                    JEV_MAX_CV_TEXT_LENGTH - text.length
                  )
                }
                if (text.length >= JEV_MAX_CV_TEXT_LENGTH) break
              }
              page.cleanup()
              text += "\n".slice(0, JEV_MAX_CV_TEXT_LENGTH - text.length)
            }
            return text.trim()
          })
        ).mapError((cause) =>
          cvError("invalid_pdf", "The CV text could not be read. Upload a valid PDF.", cause)
        )
  const cleanup = (await Result.tryPromise(() => document.loadingTask.destroy())).mapError(
    (cause) => cvError("cleanup", "The CV parser could not release the document.", cause)
  )
  if (textResult.isErr()) return textResult
  if (cleanup.isErr()) return Result.err(cleanup.error)
  if (!textResult.value) {
    return Result.err(
      cvError("no_text", "The CV has no selectable text. Upload a PDF with selectable text.")
    )
  }
  return textResult
}

export async function loadCandidateCvText(resume: Resume | null): Promise<Result<string, Error>> {
  if (!resume?.cvFile) return Result.ok("")
  const path = validateCvPath(resume)
  if (path.isErr()) return path
  const download = (
    await Result.tryPromise(() =>
      getSupabaseAdmin()
        .storage.from(process.env.SUPABASE_CV_BUCKET ?? "biovity_cv")
        .download(path.value)
    )
  ).mapError((cause) =>
    cvError("download", "The CV download failed. Check the storage service.", cause)
  )
  if (download.isErr()) return Result.err(download.error)
  if (download.value.error || !download.value.data) {
    return Result.err(
      cvError("download", "The CV download failed. Upload the CV again.", download.value.error)
    )
  }
  return extractCvText(download.value.data)
}
