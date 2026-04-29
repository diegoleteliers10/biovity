"use client"

import { ArrowLeft, FlaskConical, Search } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { Fragment } from "react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "404 - Pagina no encontrada | Biovity",
  description:
    "La pagina que buscas no existe. Explora oportunidades laborales en biotecnologia, bioquimica y ciencias en Chile.",
  robots: {
    index: false,
    follow: false,
  },
}

const HEXAGON_BONDS = [
  { x1: 250, y1: 170, x2: 320, y2: 210 },
  { x1: 320, y1: 210, x2: 320, y2: 290 },
  { x1: 320, y1: 290, x2: 250, y2: 330 },
  { x1: 250, y1: 330, x2: 180, y2: 290 },
  { x1: 180, y1: 290, x2: 180, y2: 210 },
  { x1: 180, y1: 210, x2: 250, y2: 170 },
]

const EXTENDED_BONDS = [
  { x1: 250, y1: 170, x2: 250, y2: 100, delay: 1.2 },
  { x1: 320, y1: 210, x2: 390, y2: 180, delay: 1.4 },
  { x1: 320, y1: 290, x2: 390, y2: 320, delay: 1.6 },
  { x1: 180, y1: 210, x2: 110, y2: 180, delay: 1.3 },
  { x1: 180, y1: 290, x2: 110, y2: 320, delay: 1.5 },
  { x1: 250, y1: 330, x2: 250, y2: 400, delay: 1.7 },
]

const VERTEX_NODES = [
  { cx: 250, cy: 170, r: 14, color: "#006b5e", delay: 0 },
  { cx: 320, cy: 210, r: 10, color: "#8483d4", delay: 0.2 },
  { cx: 320, cy: 290, r: 12, color: "#00374a", delay: 0.4 },
  { cx: 250, cy: 330, r: 14, color: "#006b5e", delay: 0.6 },
  { cx: 180, cy: 290, r: 10, color: "#8483d4", delay: 0.8 },
  { cx: 180, cy: 210, r: 12, color: "#00374a", delay: 1.0 },
]

const OUTER_NODES = [
  { cx: 250, cy: 100, r: 8, color: "#006b5e", anim: { y: [0, -10, 0] } },
  { cx: 390, cy: 180, r: 7, color: "#8483d4", anim: { x: [0, 10, 0] } },
  { cx: 390, cy: 320, r: 9, color: "#00374a", anim: { y: [0, 12, 0] } },
  { cx: 110, cy: 180, r: 7, color: "#8483d4", anim: { x: [0, -10, 0] } },
  { cx: 110, cy: 320, r: 8, color: "#006b5e", anim: { y: [0, 10, 0] } },
  { cx: 250, cy: 400, r: 9, color: "#00374a", anim: { y: [0, 12, 0] } },
]

const PARTICLES = [
  { cx: 430, cy: 250, r: 2.3, color: "#006b5e", delay: 2.0, duration: 4.1 },
  { cx: 392, cy: 336, r: 1.8, color: "#8483d4", delay: 2.2, duration: 4.9 },
  { cx: 328, cy: 395, r: 2.2, color: "#00374a", delay: 2.4, duration: 5.3 },
  { cx: 250, cy: 430, r: 1.9, color: "#006b5e", delay: 2.6, duration: 4.8 },
  { cx: 170, cy: 398, r: 2.5, color: "#8483d4", delay: 2.8, duration: 5.6 },
  { cx: 107, cy: 335, r: 1.7, color: "#00374a", delay: 3.0, duration: 5.1 },
  { cx: 72, cy: 250, r: 2.1, color: "#006b5e", delay: 3.2, duration: 4.4 },
  { cx: 106, cy: 167, r: 2.4, color: "#8483d4", delay: 3.4, duration: 5.7 },
  { cx: 170, cy: 104, r: 1.6, color: "#00374a", delay: 3.6, duration: 4.6 },
  { cx: 250, cy: 68, r: 2.2, color: "#006b5e", delay: 3.8, duration: 5.4 },
  { cx: 332, cy: 106, r: 1.7, color: "#8483d4", delay: 4.0, duration: 4.5 },
  { cx: 395, cy: 166, r: 2.0, color: "#00374a", delay: 4.2, duration: 5.2 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.4,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const MoleculeIllustration = () => {
  return (
    <div className="relative size-full">
      <svg viewBox="0 0 500 500" className="size-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="nf-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006b5e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8483d4" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="nf-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8483d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00374a" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="nf-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006b5e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8483d4" stopOpacity="0.4" />
          </linearGradient>
          <filter id="nf-glow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nf-soft-glow">
            <feGaussianBlur stdDeviation="20" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.circle
          cx="250"
          cy="250"
          r="120"
          fill="#006b5e"
          opacity="0.06"
          filter="url(#nf-soft-glow)"
          animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.circle
          cx="250"
          cy="250"
          r="80"
          fill="#8483d4"
          opacity="0.08"
          filter="url(#nf-soft-glow)"
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {HEXAGON_BONDS.map((line, i) => (
          <motion.line
            key={`hex-${line.x1}-${line.y1}-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#nf-line-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: "easeOut" }}
          />
        ))}

        {EXTENDED_BONDS.map((line, i) => (
          <motion.line
            key={`ext-${line.x1}-${line.y1}-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#nf-line-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.8, delay: line.delay, ease: "easeOut" }}
          />
        ))}

        {VERTEX_NODES.map((node, i) => (
          <Fragment key={`node-${node.cx}-${node.cy}-${i}`}>
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r={node.r + 6}
              fill={node.color}
              opacity="0.15"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: node.delay + 2,
              }}
            />
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill={node.color}
              filter="url(#nf-glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + node.delay * 0.3, ease: "easeOut" }}
            />
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r={node.r * 0.4}
              fill="white"
              opacity="0.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 1 + node.delay * 0.3, ease: "easeOut" }}
            />
          </Fragment>
        ))}

        {OUTER_NODES.map((node, i) => (
          <motion.circle
            key={`outer-${node.cx}-${node.cy}-${i}`}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill={node.color}
            filter="url(#nf-glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8, ...node.anim }}
            transition={{
              scale: { duration: 0.5, delay: 1.5 + i * 0.15, ease: "easeOut" },
              opacity: { duration: 0.5, delay: 1.5 + i * 0.15 },
              x: { duration: 4 + i, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 },
              y: { duration: 4 + i, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 },
            }}
          />
        ))}

        <motion.line
          x1="320"
          y1="290"
          x2="355"
          y2="305"
          stroke="#ff6b6b"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.4, 0.7, 0.5] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2.5,
          }}
        />
        <motion.circle
          cx="365"
          cy="310"
          r="5"
          fill="#ff6b6b"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.9, 0.5], scale: [0, 1.2, 1], x: [0, 8, 5], y: [0, 5, 3] }}
          transition={{ duration: 2, delay: 2.8, ease: "easeOut" }}
        />

        {PARTICLES.map((particle, i) => (
          <motion.circle
            key={`particle-${particle.cx}-${particle.cy}-${i}`}
            cx={particle.cx}
            cy={particle.cy}
            r={particle.r}
            fill={particle.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.2, 0.4, 0] }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-[#fafbfc] font-sans">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,55,74,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,55,74,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] h-[50vw] w-[50vw] rounded-full bg-[#006b5e] opacity-[0.08] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute right-[-10%] bottom-[-15%] h-[55vw] w-[55vw] rounded-full bg-[#8483d4] opacity-[0.1] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 6,
          }}
          className="absolute top-[40%] right-[-5%] h-[35vw] w-[35vw] rounded-full bg-[#00374a] opacity-[0.06] blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{
            duration: 22,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-[10%] left-[40%] h-[30vw] w-[30vw] rounded-full bg-[#006b5e] opacity-[0.05] blur-[90px]"
        />
      </div>

      <header className="relative z-20 flex w-full items-center justify-between p-6 md:p-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image src="/logoIcon.png" alt="Biovity" width={120} height={40} priority />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16 md:px-12">
        <div className="flex w-full max-w-6xl flex-col items-center gap-4 lg:flex-row lg:gap-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="h-56 w-56 shrink-0 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-[420px] lg:w-[420px]"
          >
            <MoleculeIllustration />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex max-w-xl flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#8483d4]/10 px-4 py-1.5 text-xs font-semibold uppercase text-[#8483d4]"
            >
              <FlaskConical size={14} aria-hidden />
              Error 404
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mb-4 bg-gradient-to-br from-[#00374a] via-[#006b5e] to-[#8483d4] bg-clip-text text-[5.5rem] leading-[0.85] font-bold text-transparent sm:text-[7rem] md:text-[9rem] lg:text-[11rem]"
            >
              404
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="mb-4 text-balance text-2xl leading-tight font-semibold text-[#00374A] sm:text-3xl md:text-[2.5rem]"
            >
              Pagina no encontrada
            </motion.h2>

            <motion.div variants={itemVariants} className="mb-6 flex gap-1.5">
              <div className="h-1 w-10 rounded-full bg-[#006b5e]" />
              <div className="h-1 w-4 rounded-full bg-[#8483d4]" />
              <div className="h-1 w-2 rounded-full bg-[#00374a]" />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mb-10 text-pretty text-base leading-relaxed text-[#71787d] md:text-lg"
            >
              Esta secuencia no existe en nuestro genoma. Vuelve al inicio para descubrir nuevas
              oportunidades en biotecnologia, bioquimica y ciencias de la salud.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row lg:items-start"
            >
              <Button
                asChild
                className="h-12 rounded-full border-none bg-[#006b5e] px-8 text-base font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#005a4e]"
              >
                <Link href="/" aria-label="Volver al inicio">
                  <ArrowLeft size={18} aria-hidden />
                  Volver al inicio
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-12 rounded-full px-8 text-base font-medium text-[#00374A] transition-all duration-300 hover:bg-[#006b5e]/8 hover:text-[#006b5e]"
              >
                <Link href="/trabajos" aria-label="Explorar trabajos">
                  <Search size={18} aria-hidden />
                  Explorar trabajos
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
