import type { Metadata } from "next"
import { ListaEsperaContent } from "./lista-espera-content"

export const metadata: Metadata = {
  title: "Lista de Espera",
  description:
    "Únete a la lista de espera de Biovity y sé el primero en conocer las nuevas oportunidades en biotecnología y ciencias en Chile.",
}

export default function ListaEsperaPage() {
  return <ListaEsperaContent />
}
