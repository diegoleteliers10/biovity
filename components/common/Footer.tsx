import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  const footerSections = [
    {
      title: "Para Profesionales",
      links: [
        "Buscar Empleos",
        "Subir CV",
        "Alertas de Empleo",
        "Consejos de Carrera",
        "Salarios",
        "Blog",
      ],
    },
    {
      title: "Para Empresas",
      links: [
        "Publicar Empleo",
        "Buscar Candidatos",
        "Planes y Precios",
        "Herramientas de Reclutamiento",
        "Contactar Ventas",
      ],
    },
    {
      title: "Soporte",
      links: [
        "Centro de Ayuda",
        "Contacto",
        "Términos de Servicio",
        "Política de Privacidad",
        "Política de Cookies",
      ],
    },
  ]

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
                <Mail className="w-4 h-4" />
                <span>contacto@biovity.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+56 2 2345 6789</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Santiago, Chile</span>
              </div>
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
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

            {/* Social links */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
