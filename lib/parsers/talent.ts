import { parseAsInteger, parseAsString } from "nuqs/server"

export const talentParsers = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
}
