import { parseAsInteger, parseAsString } from "nuqs/server"

export const adminOrganizationsParsers = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
}
