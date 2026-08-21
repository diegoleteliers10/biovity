"use client"

import { QuoteDownIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import Image from "next/image"
import { TESTIMONIOS_EMPRESAS } from "@/lib/data/empresas-data"

export function Testimonios() {
  if (TESTIMONIOS_EMPRESAS.length === 0) return null

  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Empresas que ya confían en Biovity para encontrar talento científico.
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIOS_EMPRESAS.map((testimonio, index) => (
            <m.div
              key={testimonio.author}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
              className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 border border-border relative"
            >
              <HugeiconsIcon
                icon={QuoteDownIcon}
                className="absolute top-6 right-6 size-8 text-secondary/20"
              />
              <p className="text-muted-foreground text-sm leading-relaxed relative z-10 mb-6">
                &ldquo;{testimonio.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3.5">
                {testimonio.image ? (
                  <Image
                    src={testimonio.image}
                    alt={testimonio.author}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {testimonio.author.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm text-foreground">{testimonio.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonio.role} en {testimonio.company}
                  </p>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
