export const JOB_ALERT_FREQUENCIES = ["instantanea", "diaria", "semanal"] as const

export type JobAlertFrequency = (typeof JOB_ALERT_FREQUENCIES)[number]

export type JobAlert = {
  id: string
  userId: string
  keywords: string | null
  location: string | null
  category: string | null
  frequency: JobAlertFrequency
  createdAt: string
  updatedAt: string
}
