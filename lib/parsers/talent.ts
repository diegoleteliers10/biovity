import { parseAsInteger, parseAsString } from "nuqs/server"

export const talentParsers = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
  view: parseAsString.withDefault(""),
  // F8.1 — Filtros faceted
  profession: parseAsString.withDefault(""),
  city: parseAsString.withDefault(""),
  country: parseAsString.withDefault(""),
  experienceLevel: parseAsString.withDefault(""),
  availability: parseAsString.withDefault(""),
  skills: parseAsString.withDefault(""),
  minExp: parseAsInteger.withDefault(0),
  maxExp: parseAsInteger.withDefault(0),
}
