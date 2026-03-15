import { parseAsInteger, parseAsString } from "nuqs/server"

export const adminUsersParsers = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
}
