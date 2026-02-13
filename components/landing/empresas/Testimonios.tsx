"use client"

import { QuoteDownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"

// TODO: Reemplazar con testimonios reales de clientes
const testimonios = [
  {
    quote:
      "Biovity nos ayudó a encontrar un investigador senior en tiempo récord. La calidad de los candidatos es excelente.",
    author: "María González",
    role: "Directora de RRHH",
    company: "Laboratorio XYZ",
    image: "/testimonials/persona1.jpg",
  },
  {
    quote:
      "El ATS es muy intuitivo y nos ha permitido reducir el tiempo de contratación en un 40%. Muy recomendable.",
    author: "Carlos Rodríguez",
    role: "Gerente de Talento",
    company: "Biotech Chile",
    image: "/testimonials/persona2.jpg",
  },
  {
    quote:
      "Por fin una plataforma enfocada en nuestro sector. Los filtros por especialidad son exactamente lo que necesitábamos.",
    author: "Andrea Muñoz",
    role: "CEO",
    company: "Pharma Solutions",
    image: "/testimonials/persona3.jpg",
  },
]

export function Testimonios() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-serif text-balance"
          >
            Lo que dicen nuestros clientes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-xl text-gray-500 max-w-3xl mx-auto text-pretty"
          >
            Empresas que ya confían en Biovity para encontrar talento científico.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonios.map((testimonio, index) => {
            return (
              <motion.div
                key={testimonio.author}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03, duration: 0.2, ease: "easeOut" }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative"
              >
                <HugeiconsIcon icon={QuoteDownIcon} className="absolute top-6 right-6 w-10 h-10 text-blue-100" />
                <p className="text-gray-600 leading-relaxed relative z-10 mb-6">
                  &ldquo;{testimonio.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonio.author}</p>
                    <p className="text-sm text-gray-500">
                      {testimonio.role} en {testimonio.company}
                    </p>
                  </div>
                  {/* TODO: Reemplazar con <Image src={testimonio.image} alt={testimonio.author} /> */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {testimonio.author.charAt(0)}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
