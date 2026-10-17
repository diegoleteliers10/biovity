export const getSafeCallbackURL = (redirect: string | null): string => {
  if (!redirect?.startsWith("/") || redirect.startsWith("//") || redirect.includes("\\")) {
    return "/dashboard"
  }

  const target = new URL(redirect, "https://biovity.invalid")
  return target.origin === "https://biovity.invalid"
    ? `${target.pathname}${target.search}${target.hash}`
    : "/dashboard"
}
