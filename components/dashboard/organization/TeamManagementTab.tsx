"use client"

import { Add01Icon, Cancel01Icon, UserGroupIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrganizationMember, OrganizationMemberRole } from "@/lib/api/organization-members"
import {
  useAddMemberMutation,
  useOrganizationMembers,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "@/lib/api/use-organization-members"
import { cn } from "@/lib/utils"
import { useDashboardSession } from "../DashboardSessionContext"
import { FieldLabel, SECTION_LABEL_CLASS } from "./SettingsUi"

const roleLabels: Record<OrganizationMemberRole, string> = {
  admin: "Admin",
  recruiter: "Reclutador",
  viewer: "Visor",
}

type TeamManagementTabProps = {
  organizationId: string
}

function MemberMonogram({ member }: { member: OrganizationMember }) {
  const name = member.user?.name ?? "Usuario"
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Avatar className="size-10 shrink-0 border border-border bg-[var(--surface-container-low)]">
      {member.user?.avatar && <AvatarImage src={member.user.avatar} alt={name} />}
      <AvatarFallback className="bg-transparent text-[13px] font-semibold tracking-[0.02em] text-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

export function TeamManagementTab({ organizationId }: TeamManagementTabProps) {
  const session = useDashboardSession()
  const currentUserId = session?.user?.id

  const { data: members, isLoading, isError } = useOrganizationMembers(organizationId)
  const addMemberMutation = useAddMemberMutation(organizationId)
  const updateRoleMutation = useUpdateMemberRoleMutation(organizationId)
  const removeMemberMutation = useRemoveMemberMutation(organizationId)

  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<OrganizationMemberRole>("recruiter")

  const handleInvite = useCallback(async () => {
    if (!inviteEmail.trim()) return
    try {
      await addMemberMutation.mutateAsync({
        userId: inviteEmail,
        role: inviteRole,
      })
      setInviteEmail("")
    } catch {
      // Error handled by mutation
    }
  }, [inviteEmail, inviteRole, addMemberMutation])

  const handleRoleChange = useCallback(
    (memberId: string, role: OrganizationMemberRole) => {
      updateRoleMutation.mutate({ memberId, role })
    },
    [updateRoleMutation]
  )

  const handleRemove = useCallback(
    (memberId: string) => {
      if (confirm("Seguro de eliminar este miembro?")) {
        removeMemberMutation.mutate(memberId)
      }
    },
    [removeMemberMutation]
  )

  const memberList = members ?? []

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground text-pretty">
        Error al cargar miembros del equipo.
      </p>
    )
  }

  return (
    <div className="space-y-10">
      <form
        className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault()
          handleInvite()
        }}
      >
        <div className="min-w-0 space-y-1.5">
          <FieldLabel htmlFor="invite-email">Email del usuario</FieldLabel>
          <Input
            id="invite-email"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            autoComplete="off"
          />
        </div>

        <div className="w-[190px] space-y-1.5">
          <FieldLabel htmlFor="invite-rol">Rol</FieldLabel>
          <Select
            value={inviteRole}
            onValueChange={(v) => setInviteRole(v as OrganizationMemberRole)}
          >
            <SelectTrigger id="invite-rol" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recruiter">Reclutador</SelectItem>
              <SelectItem value="viewer">Visor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          variant="secondary"
          disabled={!inviteEmail.trim() || addMemberMutation.isPending}
        >
          <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={1.8} />
          {addMemberMutation.isPending ? "Invitando..." : "Invitar"}
        </Button>
      </form>

      <section className="space-y-4">
        <h2 className={cn(SECTION_LABEL_CLASS, "flex items-center gap-2")}>
          <HugeiconsIcon icon={UserGroupIcon} size={14} strokeWidth={1.8} aria-hidden />
          Miembros
        </h2>

        <div className="divide-y divide-border/70">
          {memberList.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay miembros en esta organización.
            </p>
          ) : (
            memberList.map((member) => {
              const isCurrentUser = member.userId === currentUserId
              const role = roleLabels[member.role]
              const email = member.user?.email ?? ""

              return (
                <div key={member.id} className="flex items-center gap-3.5 py-3">
                  <MemberMonogram member={member} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] leading-5 font-medium text-foreground">
                      {member.user?.name ?? "Usuario"}
                      {isCurrentUser && (
                        <span className="ml-1.5 text-[13px] font-normal text-muted-foreground">
                          (tú)
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-[13.5px] leading-5 text-muted-foreground">
                      {email}
                      {email && role ? " · " : ""}
                      {role}
                    </p>
                  </div>

                  {isCurrentUser ? (
                    <span className="ml-auto inline-flex items-center rounded-full bg-[var(--surface-container-low)] px-2.5 py-0.5 text-xs font-semibold tracking-[0.02em] text-foreground">
                      Propietaria
                    </span>
                  ) : (
                    <div className="ml-auto flex items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(v) =>
                          handleRoleChange(member.id, v as OrganizationMemberRole)
                        }
                      >
                        <SelectTrigger className="h-7 w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recruiter">Reclutador</SelectItem>
                          <SelectItem value="viewer">Visor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(member.id)}
                        aria-label="Eliminar miembro"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
