"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
      if ("error" in result) throw new Error(result.error)
      return result.data
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
      if ("error" in result) throw new Error(result.error)
      return result.data
    },
    enabled: Boolean(userId),
    staleTime: 0,
  })
}

export function useUpdateUserMutation(userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      const result = await updateUser(userId, input)
      if ("error" in result) throw new Error(result.error)
      return result.data
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
      if ("error" in result) throw new Error(result.error)
      return result.data
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
      if ("error" in result) throw new Error(result.error)
      return result.data
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
      if ("error" in result) throw new Error(result.error)
      return result.data
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
      if ("error" in uploadResult) throw new Error(uploadResult.error)
      const updateResult = await updateUser(userId, { avatar: uploadResult.data })
      if ("error" in updateResult) throw new Error(updateResult.error)
      return updateResult.data
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
