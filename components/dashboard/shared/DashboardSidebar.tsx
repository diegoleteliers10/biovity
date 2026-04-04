"use client"

import { FlipRightIcon, TransitionRightIcon, User02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/animate-ui/components/radix/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/ui/logo"
import { authClient } from "@/lib/auth-client"
import type { NavData } from "@/lib/types/nav"

export interface DashboardSidebarProps {
  navData: NavData
  logoutRedirect: string
  profileUrl?: string
  avatarUrl?: string | null
  avatarGradient?: {
    from: string
    to: string
  }
  logoutHoverContrastOnAccent?: boolean
  profession?: string | null
}

export function DashboardSidebar({
  navData,
  logoutRedirect,
  profileUrl = "/dashboard/profile",
  avatarUrl: avatarUrlProp,
  avatarGradient = { from: "blue-500", to: "purple-600" },
  logoutHoverContrastOnAccent = false,
  profession: professionProp,
}: DashboardSidebarProps) {
  const { state, setOpen, open } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const { signOut, useSession } = authClient
  const { data, isPending: sessionPending } = useSession()
  const sessionUser = data?.user as
    | {
        id?: string
        name?: string
        image?: string
        avatar?: string
      }
    | undefined
  const userId = sessionUser?.id
  const queryClient = useQueryClient()
  const avatarUrl = avatarUrlProp ?? sessionUser?.avatar ?? sessionUser?.image
  const userTitle = professionProp ?? navData.user.title
  const initials =
    sessionUser?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? navData.user.title.slice(0, 2).toUpperCase()

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(logoutRedirect)
          },
          onError: (context) => {
            console.error("Logout error:", context.error)
            router.push(logoutRedirect)
          },
        },
      })
    } catch (error) {
      console.error("Unexpected logout error:", error)
      router.push(logoutRedirect)
    }
  }

  const handleViewProfile = () => {
    router.push(profileUrl)
  }

  const logoutItemClassName = logoutHoverContrastOnAccent
    ? "cursor-pointer text-red-600 hover:text-accent-foreground focus:text-accent-foreground"
    : "cursor-pointer text-red-600 focus:text-red-600"

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          {state === "collapsed" ? (
            <SidebarMenuItem
              className="w-full justify-center group/logo cursor-pointer"
              onClick={() => setOpen(!open)}
              aria-label="App Logo"
            >
              <div className="relative">
                <Logo
                  size="sm"
                  className="group-hover/logo:opacity-0 transition-opacity duration-200"
                />
                <HugeiconsIcon
                  icon={FlipRightIcon}
                  size={24}
                  strokeWidth={1.5}
                  className="absolute inset-0 m-auto size-4 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-200"
                />
              </div>
            </SidebarMenuItem>
          ) : (
            <>
              <div className="flex-1">
                <SidebarMenuItem className="w-full h-auto p-2" aria-label="App Logo and Name">
                  <Logo size="sm" showText={true} textSize="md" />
                </SidebarMenuItem>
              </div>
              <SidebarTrigger className="cursor-pointer" />
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu className="font-mono">
            {navData.navMain.map((item) => {
              const isActive = pathname === item.url
              return (
                <Tooltip key={item.title} side="right" align="center">
                  <TooltipTrigger asChild>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive} size="default">
                        <button
                          type="button"
                          onClick={() => router.push(item.url)}
                          className="flex items-center w-full focus:outline-none cursor-pointer"
                        >
                          <HugeiconsIcon icon={item.icon} size={24} strokeWidth={1.5} />
                          <span>{item.title}</span>
                          {"badge" in item && item.badge != null && (
                            <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {navData.profileProgress && (
          <>
            <div className="mx-4 mb-4 p-5 bg-card border border-border rounded-xl transition-colors duration-300 group-data-[collapsible=icon]:hidden shrink-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground mb-1 text-sm">
                    {navData.profileProgress.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {navData.profileProgress.subtitle}
                  </p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                  <span className="text-xs font-bold text-primary">
                    {navData.profileProgress.percentage}%
                  </span>
                </div>
              </div>
              <div className="relative w-full bg-muted rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${navData.profileProgress.percentage}%` }}
                />
              </div>
              <button
                className="w-full text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/5 px-3 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
                type="button"
                onClick={() => router.push(profileUrl)}
                tabIndex={0}
                aria-label={`${navData.profileProgress.actionText} - ${navData.profileProgress.percentage}%`}
              >
                {navData.profileProgress.actionText}
              </button>
            </div>
            <SidebarGroup className="hidden group-data-[collapsible=icon]:flex">
              <SidebarMenu className="font-mono">
                <Tooltip side="right" align="center">
                  <TooltipTrigger asChild>
                    <SidebarMenuItem>
                      <button
                        type="button"
                        onClick={() => router.push(profileUrl)}
                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary cursor-pointer p-0 w-8 h-8 aspect-square hover:bg-primary/20 transition-colors"
                        aria-label={`Perfil ${navData.profileProgress!.percentage}%`}
                      >
                        <span className="text-[10px] font-bold tabular-nums">
                          {navData.profileProgress.percentage}%
                        </span>
                      </button>
                    </SidebarMenuItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Progreso del Perfil: {navData.profileProgress.percentage}%</p>
                    <p className="text-xs text-muted-foreground">Click para completar</p>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}

        {/* Explore Section */}
        {navData.explore && navData.explore.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              Explorar
            </SidebarGroupLabel>
            <SidebarMenu className="font-mono">
              {navData.explore.map((item) => {
                const isActive = pathname === item.url
                const tooltipText = item.tooltipCollapsed ?? item.title
                return (
                  <Tooltip key={item.title} side="right" align="center">
                    <TooltipTrigger asChild>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive} size="sm">
                          <button
                            type="button"
                            onClick={() => router.push(item.url)}
                            className="flex items-center w-full focus:outline-none cursor-pointer"
                          >
                            <HugeiconsIcon icon={item.icon} size={24} strokeWidth={1.5} />
                            <span>{item.title}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{state === "collapsed" ? tooltipText : item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                >
                  {sessionPending ? (
                    <Skeleton className="h-8 w-8 rounded-lg bg-muted" />
                  ) : (
                    <Avatar className="h-8 w-8 rounded-lg">
                      {avatarUrl ? (
                        <AvatarImage
                          src={avatarUrl}
                          alt={sessionUser?.name ?? "Avatar"}
                          className="rounded-lg object-cover"
                          loading="eager"
                        />
                      ) : null}
                      <AvatarFallback
                        className={
                          avatarGradient.from === "blue-500"
                            ? "rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
                            : "rounded-lg bg-gradient-to-br from-purple-500 to-blue-600"
                        }
                      >
                        <span className="text-white text-sm font-semibold">{initials}</span>
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {state !== "collapsed" && (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      {sessionPending ? (
                        <>
                          <Skeleton className="h-4 w-24 bg-muted" />
                          <Skeleton className="h-3 w-16 mt-1 bg-muted" />
                        </>
                      ) : (
                        <>
                          <span className="truncate font-semibold">
                            {data?.user?.name ?? navData.user.name}
                          </span>
                          <span className="truncate text-xs">{userTitle}</span>
                        </>
                      )}
                    </div>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" side="top" sideOffset={8}>
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
                  <HugeiconsIcon icon={User02Icon} size={16} strokeWidth={1.5} className="mr-2" />
                  Ver Perfil
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={handleLogout} className={logoutItemClassName}>
                  <HugeiconsIcon
                    icon={TransitionRightIcon}
                    size={16}
                    strokeWidth={1.5}
                    className="mr-2"
                  />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
