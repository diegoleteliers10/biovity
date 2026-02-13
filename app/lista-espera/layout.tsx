import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lista de espera | Biovity",
  description:
    "Únete a la lista de espera de Biovity, el portal de empleo para biotecnología, bioquímica y ciencias en Chile.",
  robots: {
    index: true,
    follow: true,
  },
}

export default function ListaEsperaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>
}
