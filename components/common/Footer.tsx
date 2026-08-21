import {
  CallIcon,
  Facebook01Icon,
  InstagramIcon,
  Linkedin02Icon,
  Mail01Icon,
  MapPinIcon,
  TwitterIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

const FOOTER_SECTIONS = [
  {
    title: "Para Profesionales",
    links: [
      { label: "Buscar Empleos", href: "/trabajos" },
      { label: "Subir CV", href: "/register" },
      { label: "Alertas de Empleo", href: "/trabajos" },
      { label: "Consejos de Carrera", href: "/consejos-carrera" },
      { label: "Salarios", href: "/salarios" },
      { label: "Compartir Salario", href: "/compartir-salario" },
      { label: "Blog", href: "/blog" },
      { label: "Lista de Espera", href: "/lista-espera" },
    ],
  },
  {
    title: "Para Empresas",
    links: [
      { label: "Publicar Empleo", href: "/dashboard/ofertas" },
      { label: "Buscar Candidatos", href: "/dashboard/talent" },
      { label: "Planes y Precios", href: "/planes" },
      { label: "Herramientas de Reclutamiento", href: "/empresas" },
      { label: "Contactar Ventas", href: "/empresas#contacto" },
    ],
  },
  {
    title: "Soporte & Recursos",
    links: [
      { label: "Sobre Nosotros", href: "/nosotros" },
      { label: "Guía de Marca", href: "/marca" },
      { label: "Términos de Servicio", href: "/terminos" },
      { label: "Política de Privacidad", href: "/privacidad" },
      { label: "Política de Cookies", href: "/cookies" },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Logo size="sm" />
              <span className="text-xl font-semibold">Biovity</span>
            </div>
            <p className="text-neutral-400 mb-6 leading-relaxed text-pretty">
              Conectando el talento científico más calificado con las mejores oportunidades en el
              sector de las biociencias en Chile.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://linkedin.com/company/biovity"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="LinkedIn de Biovity"
              >
                <HugeiconsIcon icon={Linkedin02Icon} size={20} />
              </Link>
              <Link
                href="https://twitter.com/biovity"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Twitter de Biovity"
              >
                <HugeiconsIcon icon={TwitterIcon} size={20} />
              </Link>
              <Link
                href="https://instagram.com/biovity"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Instagram de Biovity"
              >
                <HugeiconsIcon icon={InstagramIcon} size={20} />
              </Link>
              <Link
                href="https://facebook.com/biovity"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Facebook de Biovity"
              >
                <HugeiconsIcon icon={Facebook01Icon} size={20} />
              </Link>
            </div>
          </div>

          {/* Dynamic footer sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-mono font-semibold uppercase tracking-wider text-neutral-300 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info & copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400">
          <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Mail01Icon} size={16} />
              <span>contacto@biovity.cl</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CallIcon} size={16} />
              <span>+56 9 8765 4321</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={MapPinIcon} size={16} />
              <span>Santiago, Chile</span>
            </div>
          </div>
          <p>© {new Date().getFullYear()} Biovity. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
