"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  LANDING_ANIMATION,
  getSpringTransition,
  getTransition,
} from "@/lib/animations";

export function BlogHeader() {
  const reducedMotion = useReducedMotion();
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion });
  const t = (delay = 0) => getTransition({ delay, reducedMotion });

  return (
    <div className="py-16 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={ts(0)}
        className="text-5xl font-bold text-gray-900 text-balance"
      >
        Nuestro Blog
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ts(LANDING_ANIMATION.sequenceDelay)}
        className="mt-4 text-lg text-gray-600 px-4 text-pretty"
      >
        Noticias y artículos del mundo de la biotecnología y ciencias.
      </motion.p>
    </div>
  );
}
