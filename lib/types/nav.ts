import type { IconSvgElement } from "@hugeicons/react"

export type NavUser = {
  name: string
  title: string
  avatar: string
}

export type NavItem = {
  title: string
  url: string
  icon: IconSvgElement
  badge?: number
}

export type NavExploreItem = {
  title: string
  url: string
  icon: IconSvgElement
  tooltipCollapsed?: string
}

export type ProfileProgress = {
  percentage: number
  title: string
  subtitle: string
  actionText: string
}

export type NavData = {
  user: NavUser
  navMain: NavItem[]
  explore?: NavExploreItem[]
  profileProgress: ProfileProgress | null
}
