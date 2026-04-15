import type { Metadata } from "next"
import { ListaEsperaContent } from "./lista-espera-content"

export const metadata: Metadata = {
  title: "Lista de Espera | Biovity",
  description:
    "Únete a la lista de espera de Biovity y sé el primero en conocer las nuevas oportunidades en biotecnología y ciencias en Chile.",
  openGraph: {
    title: "Lista de Espera | Biovity",
    description:
      "Únete a la lista de espera de Biovity y sé el primero en conocer las nuevas oportunidades en biotecnología y ciencias en Chile.",
    url: "/lista-espera",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Biovity - Lista de Espera",
      },
    ],
  },
  twitter: {
    title: "Lista de Espera | Biovity",
    description:
      "Únete a la lista de espera de Biovity y sé el primero en conocer las nuevas oportunidades en biotecnología y ciencias.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/lista-espera",
  },
}

export default function ListaEsperaPage() {
  return <ListaEsperaContent />
}
