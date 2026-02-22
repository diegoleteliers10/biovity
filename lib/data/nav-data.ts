import {
  Analytics01Icon,
  Bookmark02Icon,
  BubbleChatIcon,
  Calendar03Icon,
  DashboardSquare02Icon,
  File02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

export const NAV_DATA = {
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
