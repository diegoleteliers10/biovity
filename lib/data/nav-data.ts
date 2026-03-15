import type { NavData } from "@/lib/types/nav"
import {
  Analytics01Icon,
  Bookmark02Icon,
  BubbleChatIcon,
  Building02Icon,
  Calendar03Icon,
  DashboardSquare02Icon,
  File02Icon,
  FileAddIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

export const NAV_DATA: NavData = {
  user: {
    name: "Aline Larroucau",
    title: "Biotecnóloga",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardSquare02Icon,
    },
    {
      title: "Mensajes",
      url: "/dashboard/messages",
      icon: BubbleChatIcon,
    },
    {
      title: "Metricas",
      url: "/dashboard/metrics",
      icon: Analytics01Icon,
    },
    {
      title: "Mis Aplicaciones",
      url: "/dashboard/applications",
      icon: File02Icon,
      badge: 1,
    },
    {
      title: "Empleos Guardados",
      url: "/dashboard/saved",
      icon: Bookmark02Icon,
      badge: 4,
    },
    {
      title: "Calendario",
      url: "/dashboard/calendar",
      icon: Calendar03Icon,
    },
  ],
  explore: [
    {
      title: "Buscar Empleos",
      url: "/dashboard/search",
      icon: Search01Icon,
    },
  ],
  profileProgress: {
    percentage: 75,
    title: "Progreso del Perfil",
    subtitle: "Completitud",
    actionText: "Completar Perfil",
  },
}

export const NAV_DATA_ORGANIZATION: NavData = {
  user: {
    name: "Organización",
    title: "Empresa",
    avatar: "",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: DashboardSquare02Icon },
    { title: "Ofertas", url: "/dashboard/ofertas", icon: FileAddIcon },
    { title: "Aplicaciones", url: "/dashboard/applications", icon: File02Icon },
    { title: "Calendario", url: "/dashboard/calendar", icon: Calendar03Icon },
    { title: "Mensajes", url: "/dashboard/messages", icon: BubbleChatIcon },
    { title: "Métricas", url: "/dashboard/metrics", icon: Analytics01Icon },
  ],
  explore: [
    { title: "Explorar Talento", url: "/dashboard/talent", icon: Search01Icon },
  ],
  profileProgress: {
    percentage: 60,
    title: "Perfil Organización",
    subtitle: "Completitud",
    actionText: "Completar Perfil",
  },
}
