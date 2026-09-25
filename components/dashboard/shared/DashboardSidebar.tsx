"use client"

import {
  Comment01Icon,
  CustomerSupportIcon,
  FlipRightIcon,
  TransitionRightIcon,
  User02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useFeaturebase } from "featurebase-js/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { memo, type ReactElement, type ReactNode, useMemo, useRef } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/ui/logo"
import { Skeleton } from "@/components/ui/skeleton"
import type { ServerSession } from "@/lib/auth"
import { signOutAndRedirect } from "@/lib/auth-client"
import type { NavData, NavExploreItem, NavItem } from "@/lib/types/nav"
import { cn } from "@/lib/utils"

const NAV_BUTTON_CLASS = "hover:bg-sidebar-accent/50 transition-colors duration-150"
const NAV_ICON_CLASS = "shrink-0"

function NavTooltip({ trigger, content }: { trigger: ReactElement; content: ReactNode }) {
  return (
    <Tooltip side="right" align="center">
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}

type NavRowProps = {
  item: NavItem | NavExploreItem
  pathname: string
  collapsed: boolean
  isMobile: boolean
  size: "default" | "sm"
  onNavigate: () => void
}

const NavRow = memo(function NavRow({
  item,
  pathname,
  collapsed,
  isMobile,
  size,
  onNavigate,
}: NavRowProps) {
  const isActive = pathname === item.url
  const row = (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} size={size} className={NAV_BUTTON_CLASS}>
        <Link
          href={item.url}
          prefetch
          onClick={onNavigate}
          className="flex items-center w-full focus:outline-none cursor-pointer"
        >
          <HugeiconsIcon icon={item.icon} size={20} strokeWidth={1.5} className={NAV_ICON_CLASS} />
          <span>{item.title}</span>
          {"badge" in item && item.badge != null && (
            <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {item.badge}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
  if (isMobile || !collapsed) return row
  const tooltipText =
    "tooltipCollapsed" in item && item.tooltipCollapsed ? item.tooltipCollapsed : item.title
  return <NavTooltip trigger={row} content={<p>{tooltipText}</p>} />
})

export type DashboardSidebarProps = {
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
  session?: ServerSession | null
}

export function DashboardSidebar({
  navData,
  logoutRedirect,
  profileUrl = "/dashboard/profile",
  avatarUrl: avatarUrlProp,
  avatarGradient = { from: "blue-500", to: "purple-600" },
  logoutHoverContrastOnAccent = false,
  profession: professionProp,
  session,
}: DashboardSidebarProps) {
  const { state, setOpen, open, setOpenMobile, isMobile } = useSidebar()
  const pathname = usePathname()
  const { push } = useRouter()
  const { show: showFeaturebaseMessenger } = useFeaturebase()
  const feedbackPortalRef = useRef<HTMLButtonElement>(null)
  const collapsed = state === "collapsed"

  const sessionUser = session?.user as
    | {
        id?: string
        name?: string
        image?: string
        avatar?: string
      }
    | undefined
  const avatarUrl = avatarUrlProp ?? sessionUser?.avatar ?? sessionUser?.image
  const userTitle = professionProp ?? navData.user.title
  const initials = useMemo(
    () =>
      sessionUser?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ?? navData.user.title.slice(0, 2).toUpperCase(),
    [sessionUser?.name, navData.user.title]
  )

  const closeMobileSheet = () => {
    if (isMobile) setOpenMobile(false)
  }

  const handleLogout = async () => {
    await signOutAndRedirect(logoutRedirect).catch((error: unknown) => {
      console.error("Unexpected logout error:", error)
      window.location.href = logoutRedirect
    })
  }

  const handleViewProfile = () => {
    closeMobileSheet()
    push(profileUrl)
  }

  const handleFeedback = () => {
    feedbackPortalRef.current?.click()
    closeMobileSheet()
  }

  const handleSupport = () => {
    showFeaturebaseMessenger()
    closeMobileSheet()
  }

  const logoutItemClassName = logoutHoverContrastOnAccent
    ? "cursor-pointer text-red-600 hover:text-accent-foreground focus:text-accent-foreground"
    : "cursor-pointer text-red-600 focus:text-red-600"

  return (
    <Sidebar collapsible="icon" animateOnHover={false} className="border-none">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          {collapsed ? (
            <SidebarMenuItem
              className="w-full justify-center group/logo cursor-pointer"
              onClick={() => setOpen(!open)}
              aria-label="App Logo"
            >
              <div className="relative">
                <Logo
                  size="sm"
                  className="group-hover/logo:opacity-0 transition-opacity duration-150"
                />
                <HugeiconsIcon
                  icon={FlipRightIcon}
                  size={20}
                  strokeWidth={1.5}
                  className="absolute inset-0 m-auto size-4 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-150"
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
        <SidebarGroup>
          <SidebarMenu>
            {navData.navMain.map((item) => (
              <NavRow
                key={item.title}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
                isMobile={isMobile}
                size="default"
                onNavigate={closeMobileSheet}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {navData.profileProgress && (
          <>
            <div className="mx-4 mb-4 p-5 bg-card border border-border rounded-xl group-data-[collapsible=icon]:hidden shrink-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground mb-1 text-sm">
                    {navData.profileProgress.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {navData.profileProgress.subtitle}
                  </p>
                </div>
                <div className="flex items-center justify-center size-8 bg-primary/10 rounded-full">
                  <span className="text-xs font-bold text-primary">
                    {navData.profileProgress.percentage}%
                  </span>
                </div>
              </div>
              <div className="relative w-full bg-muted rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
                  style={{ width: `${navData.profileProgress.percentage}%` }}
                />
              </div>
              <button
                className="w-full text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/5 px-3 py-2 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1"
                type="button"
                onClick={() => push(profileUrl)}
                tabIndex={0}
                aria-label={`${navData.profileProgress.actionText} - ${navData.profileProgress.percentage}%`}
              >
                {navData.profileProgress.actionText}
              </button>
            </div>
            <SidebarGroup className="hidden group-data-[collapsible=icon]:flex">
              <SidebarMenu>
                <SidebarMenuItem>
                  <button
                    type="button"
                    onClick={() => push(profileUrl)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary cursor-pointer p-0 aspect-square hover:bg-primary/20 transition-colors duration-150"
                    aria-label={`Perfil ${navData.profileProgress?.percentage}%`}
                  >
                    <span className="text-[10px] font-bold tabular-nums">
                      {navData.profileProgress.percentage}%
                    </span>
                  </button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}

        {navData.explore && navData.explore.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
              Explorar
            </SidebarGroupLabel>
            <SidebarMenu>
              {navData.explore.map((item) => (
                <NavRow
                  key={item.title}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                  isMobile={isMobile}
                  size="sm"
                  onNavigate={closeMobileSheet}
                />
              ))}
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
                  {session ? (
                    <Avatar className="size-8 rounded-lg">
                      {avatarUrl ? (
                        <AvatarImage
                          src={avatarUrl}
                          alt={sessionUser?.name ?? "Avatar"}
                          className="rounded-lg object-cover"
                          loading="eager"
                        />
                      ) : null}
                      <AvatarFallback
                        className={cn(
                          "rounded-lg bg-gradient-to-br",
                          avatarGradient.from === "blue-500"
                            ? "from-blue-500 to-purple-600"
                            : "from-purple-500 to-blue-600"
                        )}
                      >
                        <span className="text-white text-sm font-semibold">{initials}</span>
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Skeleton className="size-8 rounded-lg bg-muted" />
                  )}
                  {!collapsed && (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      {session ? (
                        <>
                          <span className="truncate font-semibold">
                            {sessionUser?.name ?? navData.user.name}
                          </span>
                          <span className="truncate text-xs">{userTitle}</span>
                        </>
                      ) : (
                        <>
                          <Skeleton className="h-4 w-24 bg-muted" />
                          <Skeleton className="h-3 w-16 mt-1 bg-muted" />
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
                <DropdownMenuItem onClick={handleFeedback} className="cursor-pointer">
                  <HugeiconsIcon
                    icon={Comment01Icon}
                    size={16}
                    strokeWidth={1.5}
                    className="mr-2"
                  />
                  Feedback
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSupport} className="cursor-pointer">
                  <HugeiconsIcon
                    icon={CustomerSupportIcon}
                    size={16}
                    strokeWidth={1.5}
                    className="mr-2"
                  />
                  Soporte
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className={logoutItemClassName}
                >
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
            <button
              ref={feedbackPortalRef}
              type="button"
              data-featurebase-feedback
              hidden
              aria-hidden="true"
              tabIndex={-1}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
