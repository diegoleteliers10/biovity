import { parseAsInteger, parseAsString } from "nuqs/server"

export const trabajosParsers = {
  q: parseAsString.withDefault(""),
  ubicacion: parseAsString.withDefault(""),
  modalidad: parseAsString.withDefault(""),
  formato: parseAsString.withDefault(""),
  salarioMin: parseAsInteger,
  salarioMax: parseAsInteger,
  experiencia: parseAsString.withDefault(""),
  categoria: parseAsString,
}
