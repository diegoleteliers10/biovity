"use client"

import { motion } from "motion/react"
import Image from "next/image"

export function BlogHeader() {
  return (
    <div className="py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="font-rubik text-5xl font-bold text-gray-900 text-balance"
        >
          Nuestro Blog
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
          className="mt-4 text-lg text-gray-600 px-4 text-pretty"
        >
          Noticias y artículos del mundo de la biotecnología y ciencias.
        </motion.p>
      </motion.div>
    </div>
  )
}
