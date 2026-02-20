"use client"

import * as m from "motion/react-m"

// TODO: Reemplazar con logos reales de empresas clientes
const placeholderLogos = [
  { name: "Empresa 1", logo: "/logos/empresa1.svg" },
  { name: "Empresa 2", logo: "/logos/empresa2.svg" },
  { name: "Empresa 3", logo: "/logos/empresa3.svg" },
  { name: "Empresa 4", logo: "/logos/empresa4.svg" },
  { name: "Empresa 5", logo: "/logos/empresa5.svg" },
  { name: "Empresa 6", logo: "/logos/empresa6.svg" },
]

export function LogosEmpresas() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-center text-sm font-medium text-gray-500 mb-8 uppercase tracking-wider"
        >
          Empresas que confían en nosotros
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {placeholderLogos.map((company, index) => {
            return (
              <m.div
                key={company.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03, duration: 0.2, ease: "easeOut" }}
                className="w-24 h-12 md:w-32 md:h-16 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                {/* TODO: Reemplazar con <Image src={company.logo} alt={company.name} /> */}
                <span className="text-xs text-gray-400 font-medium">{company.name}</span>
              </m.div>
            )
          })}
        </m.div>
      </div>
    </section>
  )
}
