"use client"

import { Settings01Icon, TransitionRightIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePathname, useRouter } from "next/navigation"
import type { ReactNode } from "react"
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
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/animate-ui/components/radix/sidebar"
import { Avatar } from "@/components/ui/avatar"
import { NAV_DATA } from "@/lib/data/nav-data"

interface DashboardLayoutProps {
  children: ReactNode
}

const SidebarComponent = () => {
  const { state, setOpen, open } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()

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
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground relative overflow-hidden">
                <span className="text-sm font-bold group-hover/logo:opacity-0 transition-opacity duration-200">
                  B
                </span>
                <HugeiconsIcon
                  icon={TransitionRightIcon}
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
                  <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <span className="text-sm font-bold">B</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-foreground">Biovity</span>
                      <span className="text-xs text-muted-foreground">Dashboard</span>
                    </div>
                  </div>
                </SidebarMenuItem>
              </div>
              <SidebarTrigger className="cursor-pointer"/>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu className="font-mono">
            {NAV_DATA.navMain.map((item) => {
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
                          {item.badge && (
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

        {/* Explore Section */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Explorar</SidebarGroupLabel>
          <SidebarMenu className="font-mono">
            {NAV_DATA.explore.map((item) => {
              const isActive = pathname === item.url
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
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Profile Progress Card */}
        <div
          className={`mx-4 mb-4 p-4 bg-white rounded-lg transition-opacity duration-300 shadow-sm group-data-[collapsible=icon]:hidden`}
        >
          <h3 className="font-semibold text-gray-800 mb-2">{NAV_DATA.profileProgress.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{NAV_DATA.profileProgress.subtitle}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-gray-800 h-2 rounded-full"
              style={{ width: `${NAV_DATA.profileProgress.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{NAV_DATA.profileProgress.percentage}%</span>
            <button className="text-sm text-gray-600 hover:text-gray-800" type="button" onClick={() => router.push("/dashboard/employee/profile")}>
              {NAV_DATA.profileProgress.actionText}
            </button>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        {/*<Tooltip side="right" align="center">
          <TooltipTrigger asChild>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard/employee/settings">
                  <HugeiconsIcon icon={Settings01Icon} size={24} strokeWidth={1.5} />
                  <span>Configuración</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>Configuración</p>
          </TooltipContent>
        </Tooltip>*/}

        {/* User Profile */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              onClick={() => router.push("/dashboard/employee/profile")}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <div className="h-full w-full rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {NAV_DATA.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{NAV_DATA.user.name}</span>
                <span className="truncate text-xs">{NAV_DATA.user.title}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider className="pt-2 pl-2 bg-sidebar">
      <SidebarComponent />
      <SidebarInset className="rounded-tl-lg">{children}</SidebarInset>
    </SidebarProvider>
  )
}
