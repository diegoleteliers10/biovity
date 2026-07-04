"use client"

import { QuoteDownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import Image from "next/image"
import { TESTIMONIOS_EMPRESAS } from "@/lib/data/empresas-data"

export function Testimonios() {
  if (TESTIMONIOS_EMPRESAS.length === 0) return null

  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <m.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-semibold text-zinc-900 mb-4 tracking-tight font-serif text-balance"
          >
            Lo que dicen nuestros clientes
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-xl text-zinc-500 max-w-3xl mx-auto text-pretty"
          >
            Empresas que ya confían en Biovity para encontrar talento científico.
          </m.p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {TESTIMONIOS_EMPRESAS.map((testimonio, index) => {
            return (
              <m.div
                key={testimonio.author}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03, duration: 0.2, ease: "easeOut" }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100 relative"
              >
                <HugeiconsIcon
                  icon={QuoteDownIcon}
                  className="absolute top-6 right-6 size-10 text-blue-100"
                />
                <p className="text-zinc-600 leading-relaxed relative z-10 mb-6">
                  &ldquo;{testimonio.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-zinc-900">{testimonio.author}</p>
                    <p className="text-sm text-zinc-500">
                      {testimonio.role} en {testimonio.company}
                    </p>
                  </div>
                  {testimonio.image ? (
                    <Image
                      src={testimonio.image}
                      alt={testimonio.author}
                      width={48}
                      height={48}
                      className="size-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-12 rounded-full bg-gradient-to-br from-blue-400 to-zinc-600 flex items-center justify-center text-white font-semibold">
                      {testimonio.author.charAt(0)}
                    </div>
                  )}
                </div>
              </m.div>
            )
          })}
        </m.div>
      </div>
    </section>
  )
}
