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
      { label: "Consejos de Carrera", href: "/blog" },
      { label: "Salarios", href: "/salarios" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Para Empresas",
    links: [
      { label: "Publicar Empleo", href: "/empresas" },
      { label: "Buscar Candidatos", href: "/empresas" },
      { label: "Planes y Precios", href: "/empresas" },
      { label: "Herramientas de Reclutamiento", href: "/empresas" },
      { label: "Contactar Ventas", href: "/empresas#contacto" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: "Centro de Ayuda", href: "/nosotros" },
      { label: "Contacto", href: "/empresas#contacto" },
      { label: "Términos de Servicio", href: "/" },
      { label: "Política de Privacidad", href: "/" },
      { label: "Política de Cookies", href: "/" },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Logo size="sm" />
              <span className="text-xl font-semibold">Biovity</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              La plataforma líder que conecta talento científico con las mejores oportunidades en
              biotecnología, química, farmacia y áreas relacionadas.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <HugeiconsIcon icon={Mail01Icon} className="w-4 h-4" />
                <span>contacto@biovity.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <HugeiconsIcon icon={CallIcon} className="w-4 h-4" />
                <span>+56 2 2345 6789</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <HugeiconsIcon icon={MapPinIcon} className="w-4 h-4" />
                <span>Santiago, Chile</span>
              </div>
            </div>
          </div>

          {/* Footer sections */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2024 Biovity. Todos los derechos reservados.
            </div>

            {/* Social links - placeholder until social URLs are configured */}
            <div className="flex items-center space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <HugeiconsIcon icon={Facebook01Icon} className="w-5 h-5" />
              </Link>
              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <HugeiconsIcon icon={TwitterIcon} className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <HugeiconsIcon icon={Linkedin02Icon} className="w-5 h-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <HugeiconsIcon icon={InstagramIcon} className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
