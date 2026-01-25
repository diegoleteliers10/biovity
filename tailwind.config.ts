import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        "Satoshi",
        "Inter",
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
      ],
      serif: ["Instrument Serif", "Georgia", "Times New Roman", "serif"],
      mono: ["var(--font-geist-mono)", "Courier New", "monospace"],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
}
export default config
