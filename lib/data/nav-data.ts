import {
  BubbleChatIcon,
  Analytics01Icon,
  Calendar03Icon,
  Search01Icon,
  Bookmark02Icon,
  File02Icon,
  DashboardSquare02Icon,
} from "@hugeicons/core-free-icons";

export const NAV_DATA = {
  user: {
    name: "Aline Larroucau",
    title: "Biotecnóloga",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/employee",
      icon: DashboardSquare02Icon,
    },
    {
      title: "Mensajes",
      url: "/dashboard/employee/messages",
      icon: BubbleChatIcon,
    },
    {
      title: "Metricas",
      url: "/dashboard/employee/metrics",
      icon: Analytics01Icon,
    },
    {
      title: "Mis Aplicaciones",
      url: "/dashboard/employee/applications",
      icon: File02Icon,
      badge: 1,
    },
    {
      title: "Empleos Guardados",
      url: "/dashboard/employee/saved",
      icon: Bookmark02Icon,
      badge: 4,
    },
    {
      title: "Calendario",
      url: "/dashboard/employee/calendar",
      icon: Calendar03Icon,
    },
  ],
  explore: [
    {
      title: "Buscar Empleos",
      url: "/dashboard/employee/search",
      icon: Search01Icon,
    },
  ],
  profileProgress: {
    percentage: 75,
    title: "Progreso del Perfil",
    subtitle: "Completitud",
    actionText: "Completar Perfil",
  },
};