import type { IconSvgElement } from "@hugeicons/react"

export interface NavUser {
  name: string
  title: string
  avatar: string
}

export interface NavItem {
  title: string
  url: string
  icon: IconSvgElement
  badge?: number
}

export interface NavExploreItem {
  title: string
  url: string
  icon: IconSvgElement
}

export interface ProfileProgress {
  percentage: number
  title: string
  subtitle: string
  actionText: string
}

export interface NavData {
  user: NavUser
  navMain: NavItem[]
  explore?: NavExploreItem[]
  profileProgress: ProfileProgress
}
