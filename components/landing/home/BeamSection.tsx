"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations";
import { AdnBeam } from "@/components/landing/home/common/AdnBeam";

export function ConexionTalento() {
  const reducedMotion = useReducedMotion();
  const t = (delay = 0) => getTransition({ delay, reducedMotion });
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion });

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16"
        >
          <m.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Conectamos talento con empresas
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-gray-500 max-w-3xl mx-auto"
          >
            Biovity facilita el encuentro entre profesionales del sector científico y empresas que buscan talento especializado.
          </m.p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={ts(LANDING_ANIMATION.sequenceDelay)}
          className="flex flex-col items-center"
        >
          <div className="w-full max-w-3xl mb-12 mx-auto flex justify-center">
            <AdnBeam />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <m.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(LANDING_ANIMATION.sequenceDelay * 2)}
              className="text-center p-6"
            >
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <span className="text-6xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Empresas publican</h3>
              <p className="text-gray-500">Publica ofertas de trabajo dirigidas específicamente al sector científico.</p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(LANDING_ANIMATION.sequenceDelay * 3)}
              className="text-center p-6"
            >
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <span className="text-6xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Candidatos postulan</h3>
              <p className="text-gray-500">Profesionales especializados encuentran y postulan a las mejores oportunidades.</p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(LANDING_ANIMATION.sequenceDelay * 4)}
              className="text-center p-6"
            >
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <span className="text-6xl font-bold text-violet-600">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Match perfecto</h3>
              <p className="text-gray-500">Nuestro AI Matching conecta a los candidatos ideales con tu empresa.</p>
            </m.div>
          </div>
        </m.div>
      </div>
    </section>
  );
}