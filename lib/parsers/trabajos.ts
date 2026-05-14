import { parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs/server"

export const trabajosParsers = {
  q: parseAsString.withDefault(""),
  ubicacion: parseAsString.withDefault(""),
  modalidad: parseAsString.withDefault(""),
  formato: parseAsString.withDefault(""),
  salarioMin: parseAsInteger,
  salarioMax: parseAsInteger,
  moneda: parseAsStringLiteral(["CLP", "USD"] as const).withDefault("CLP"),
  experiencia: parseAsString.withDefault(""),
  categoria: parseAsString,
}
