"use client"

import { Cancel01Icon, UserGroupIcon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrganizationMemberRole } from "@/lib/api/organization-members"
import {
  useAddMemberMutation,
  useOrganizationMembers,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "@/lib/api/use-organization-members"
import { useDashboardSession } from "../DashboardSessionContext"

const roleLabels: Record<OrganizationMemberRole, string> = {
  admin: "Admin",
  recruiter: "Reclutador",
  viewer: "Visor",
}

const roleColors: Record<OrganizationMemberRole, string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  recruiter: "bg-accent/10 text-accent border-accent/20",
  viewer: "bg-muted text-muted-foreground",
}

type TeamManagementTabProps = {
  organizationId: string
}

export function TeamManagementTab({ organizationId }: TeamManagementTabProps) {
  const session = useDashboardSession()
  const currentUserId = session?.user?.id

  const { data: members = [], isLoading, isError } = useOrganizationMembers(organizationId)
  const addMemberMutation = useAddMemberMutation(organizationId)
  const updateRoleMutation = useUpdateMemberRoleMutation(organizationId)
  const removeMemberMutation = useRemoveMemberMutation(organizationId)

  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<OrganizationMemberRole>("recruiter")

  const handleInvite = useCallback(async () => {
    if (!inviteEmail.trim()) return
    // Look up user by email (simplified - backend handles it)
    try {
      await addMemberMutation.mutateAsync({
        userId: inviteEmail, // In a real flow, this would be resolved from email
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Error al cargar miembros del equipo.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <HugeiconsIcon icon={UserGroupIcon} size={20} className="text-primary" />
          Gestión de Equipo
        </CardTitle>
        <CardDescription>
          Invita y administra los miembros de tu organización.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email del usuario</label>
            <Input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Rol</label>
            <Select
              value={inviteRole}
              onValueChange={(v) => setInviteRole(v as OrganizationMemberRole)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="recruiter">Reclutador</SelectItem>
                <SelectItem value="viewer">Visor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleInvite}
            disabled={!inviteEmail.trim() || addMemberMutation.isPending}
          >
            <HugeiconsIcon icon={UserIcon} size={16} />
            Invitar
          </Button>
        </div>

        <div className="divide-y divide-border/60">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay miembros en esta organización.
            </p>
          ) : (
            members.map((member) => {
              const initials = member.user?.name
                ? member.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "??"

              const isCurrentUser = member.userId === currentUserId

              return (
                <div key={member.id} className="flex items-center gap-4 py-3">
                  <Avatar className="size-10">
                    {member.user?.avatar && (
                      <AvatarImage src={member.user.avatar} alt={member.user.name} />
                    )}
                    <AvatarFallback className="bg-secondary/10 text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {member.user?.name ?? "Usuario"}
                      {isCurrentUser && (
                        <span className="text-xs text-muted-foreground ml-1.5">(tú)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.user?.email ?? ""}
                    </p>
                  </div>
                  <Select
                    value={member.role}
                    onValueChange={(v) => handleRoleChange(member.id, v as OrganizationMemberRole)}
                    disabled={isCurrentUser}
                  >
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="recruiter">Reclutador</SelectItem>
                      <SelectItem value="viewer">Visor</SelectItem>
                    </SelectContent>
                  </Select>
                  {!isCurrentUser && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(member.id)}
                      aria-label="Eliminar miembro"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={16} />
                    </Button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
