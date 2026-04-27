import { parseAsBoolean, parseAsString } from "nuqs/server"

export const employeeSearchParsers = {
  q: parseAsString.withDefault(""),
  location: parseAsString.withDefault(""),
  jobType: parseAsString.withDefault("any"),
  experience: parseAsString.withDefault("any"),
  remoteOnly: parseAsBoolean.withDefault(false),
}
