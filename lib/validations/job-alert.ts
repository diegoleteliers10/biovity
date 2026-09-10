import { z } from "zod"
import { JOB_ALERT_FREQUENCIES } from "@/lib/types/job-alert"

/**
 * Job alert creation schema
 * - All criteria optional; at least one required (keywords, location, category)
 * - Frequency stored from day one, functional when matching ships
 */
export const createJobAlertSchema = z
  .object({
    userId: z.string().uuid(),
    keywords: z.string().max(500).trim().optional(),
    location: z.string().max(200).trim().optional(),
    category: z.string().max(100).trim().optional(),
    frequency: z.enum(JOB_ALERT_FREQUENCIES).default("instantanea"),
  })
  .refine(
    (data) => Boolean(data.keywords?.trim() || data.location?.trim() || data.category?.trim()),
    { message: "Define al menos un criterio para la alerta" }
  )

export type CreateJobAlertInput = z.input<typeof createJobAlertSchema>
export type CreateJobAlertData = z.output<typeof createJobAlertSchema>
