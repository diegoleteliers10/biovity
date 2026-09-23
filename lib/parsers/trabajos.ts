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
  pagina: parseAsInteger.withDefault(1),
  orden: parseAsStringLiteral(["recientes", "antiguos", "titulo-az", "titulo-za"] as const).withDefault(
    "recientes"
  ),
}
