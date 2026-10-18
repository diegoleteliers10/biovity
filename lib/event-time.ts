import { Result, TaggedError } from "better-result"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatInTimeZone } from "date-fns-tz"

export const DEFAULT_EVENT_TIME_ZONE = "America/Santiago"

export class EventTimeError extends TaggedError("EventTimeError")<{ message: string }> {}

export function formatParticipantTime(instant: string, pattern = "dd MMM yyyy, HH:mm"): string {
  return format(new Date(instant), pattern, { locale: es })
}

export function eventWallTime(instant: string, timeZone: string): string {
  return formatInTimeZone(instant, timeZone, "yyyy-MM-dd'T'HH:mm")
}

export function organizerInstant(wallTime: string, timeZone: string, original?: string) {
  const zone = Result.try(() => new Intl.DateTimeFormat("en", { timeZone }))
  if (!/^[A-Za-z]/.test(timeZone) || zone.isErr()) {
    return Result.err(new EventTimeError({ message: "Selecciona una zona horaria IANA válida." }))
  }
  const wallMilliseconds = Date.parse(`${wallTime}:00Z`)
  if (!Number.isFinite(wallMilliseconds)) {
    return Result.err(new EventTimeError({ message: "Selecciona una fecha y hora válidas." }))
  }
  if (original && eventWallTime(original, timeZone) === wallTime) return Result.ok(original)
  const offsets = new Set<number>()
  for (let hours = -48; hours <= 48; hours += 6) {
    const sample = wallMilliseconds + hours * 3_600_000
    const sampleWall = formatInTimeZone(sample, timeZone, "yyyy-MM-dd'T'HH:mm:ss")
    offsets.add(Date.parse(`${sampleWall}Z`) - sample)
  }
  const matches = [...offsets]
    .map((offset) => new Date(wallMilliseconds - offset).toISOString())
    .filter((instant) => eventWallTime(instant, timeZone) === wallTime)
  if (matches.length !== 1) {
    return Result.err(
      new EventTimeError({
        message:
          matches.length === 0
            ? "Esta hora no existe por el cambio de horario. Selecciona otra hora."
            : "Esta hora ocurre dos veces por el cambio de horario. Selecciona otra hora.",
      })
    )
  }
  return Result.ok(matches[0])
}
