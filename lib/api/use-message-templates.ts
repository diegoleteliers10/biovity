"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Result } from "better-result"
import { getResultErrorMessage } from "@/lib/result"
import {
  type CreateMessageTemplateInput,
  createMessageTemplate,
  deleteMessageTemplate,
  getMessageTemplates,
  type MessageTemplate,
  type UpdateMessageTemplateInput,
  updateMessageTemplate,
} from "./message-templates"

export const messageTemplatesKeys = {
  byOrg: (organizationId: string) => ["message-templates", "org", organizationId] as const,
}

export function useMessageTemplates(organizationId: string | undefined) {
  const safeOrgId = organizationId ?? ""
  return useQuery({
    queryKey: messageTemplatesKeys.byOrg(safeOrgId),
    queryFn: async () => {
      if (!safeOrgId) return []
      const result = await getMessageTemplates(safeOrgId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(safeOrgId),
  })
}

export function useCreateMessageTemplateMutation(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateMessageTemplateInput) => {
      const result = await createMessageTemplate(organizationId, input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (template) => {
      qc.setQueryData<MessageTemplate[]>(messageTemplatesKeys.byOrg(organizationId), (old) =>
        old ? [template, ...old] : [template]
      )
    },
  })
}

export function useUpdateMessageTemplateMutation(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateMessageTemplateInput }) => {
      const result = await updateMessageTemplate(organizationId, id, input)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    onSuccess: (updated) => {
      qc.setQueryData<MessageTemplate[]>(messageTemplatesKeys.byOrg(organizationId), (old) =>
        old?.map((t) => (t.id === updated.id ? updated : t))
      )
    },
  })
}

export function useDeleteMessageTemplateMutation(organizationId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteMessageTemplate(organizationId, id)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
    },
    onSuccess: (_, id) => {
      qc.setQueryData<MessageTemplate[]>(messageTemplatesKeys.byOrg(organizationId), (old) =>
        old?.filter((t) => t.id !== id)
      )
    },
  })
}
