"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result as R } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson, getResultErrorMessage } from "@/lib/result"
import {
  type CreateResumeInput,
  createResume,
  getResumeByUserId,
  type UpdateResumeInput,
  updateResume,
  uploadResumeCv,
} from "./resumes"
import {
  formatUserLocation,
  getUser,
  type UpdateUserInput,
  type UserLocation,
  updateUser,
  uploadAvatar,
} from "./users"

export const profileKeys = {
  user: (id: string) => ["profile", "user", id] as const,
  resume: (userId: string) => ["profile", "resume", userId] as const,
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: profileKeys.user(id ?? ""),
    queryFn: async () => {
      if (!id) throw new Error("User ID required")
      const result = await getUser(id)
      if (!R.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(id),
  })
}

export function useResumeByUser(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.resume(userId ?? ""),
    queryFn: async () => {
      if (!userId) throw new Error("User ID required")
      const result = await getResumeByUserId(userId)
      if (!R.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(userId),
  })
}

export function useUpdateUserMutation(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      const result = await updateUser(userId, input)
      if (!R.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.user(userId) })
    },
  })
}

export function useCreateResumeMutation(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<CreateResumeInput, "userId">) => {
      const result = await createResume({ ...input, userId })
      if (!R.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.resume(userId) })
    },
  })
}

export function useUpdateResumeMutation(resumeId: string, userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateResumeInput) => {
      const result = await updateResume(resumeId, input)
      if (!R.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.resume(userId) })
    },
  })
}

export function useUploadResumeCvMutation(resumeId: string, userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const result = await uploadResumeCv(resumeId, file)
      if (!R.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.resume(userId) })
    },
  })
}

export function useUploadAvatarMutation(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const uploadResult = await uploadAvatar(file)
      if (!R.isOk(uploadResult)) throw new Error(getResultErrorMessage(uploadResult.error))
      const updateResult = await updateUser(userId, { avatar: uploadResult.value })
      if (!R.isOk(updateResult)) throw new Error(getResultErrorMessage(updateResult.error))
      return updateResult.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.user(userId) })
    },
  })
}

export function parseLocationString(value: string): UserLocation {
  const [city, country] = value.split(",").map((s) => s.trim())
  return { city: city || undefined, country: country || undefined }
}

export { formatUserLocation }

export function locationToFormData(
  loc: { street?: string; city?: string; country?: string } | null
): {
  street: string
  city: string
  country: string
} {
  if (!loc) return { street: "", city: "", country: "" }
  return {
    street: loc.street ?? "",
    city: loc.city ?? "",
    country: loc.country ?? "",
  }
}

export async function deleteAvatar(): Promise<R<void, ApiError | NetworkError>> {
  const result = await fetchJson<void>("/api/delete/avatar", { method: "DELETE" })
  if (result.isErr()) return R.err(result.error)
  return R.ok(undefined)
}

export async function deleteCv(
  resumeId: string,
  cvPath: string
): Promise<R<void, ApiError | NetworkError>> {
  const result = await fetchJson<void>(
    `/api/delete/cv?resumeId=${encodeURIComponent(resumeId)}&path=${encodeURIComponent(cvPath)}`,
    { method: "DELETE" }
  )
  if (result.isErr()) return R.err(result.error)
  return R.ok(undefined)
}

export function useDeleteAvatarMutation(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const result = await deleteAvatar()
      if (!R.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.user(userId) })
    },
  })
}

export function useDeleteCvMutation(resumeId: string, userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (cvPath: string) => {
      const result = await deleteCv(resumeId, cvPath)
      if (!R.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.resume(userId) })
    },
  })
}
