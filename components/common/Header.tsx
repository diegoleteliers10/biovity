"use client"

import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

const menuItems = [
  { name: "Trabajos", href: "/trabajos" },
  { name: "Empresas", href: "/empresas" },
  { name: "Nosotros", href: "/nosotros" },
  { name: "Blog", href: "/blog" },
]

const isActivePath = (pathname: string, href: string) =>
  pathname === href || (href !== "/" && pathname.startsWith(href))

export const Header = () => {
  const pathname = usePathname()
  const [menuState, setMenuState] = useState(false)

  return (
    <header>
      <nav
        data-state={menuState ? "open" : "closed"}
        className="fixed z-20 w-full px-4 lg:px-2"
      >
        <div className="mx-auto mt-4 max-w-4xl rounded-2xl border bg-background/50 px-6 backdrop-blur-lg transition-all duration-300 lg:px-5">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <Image
                  src="/logoIcon.png"
                  alt="Biovity Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </Link>

              <button
                type="button"
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <HugeiconsIcon
                  icon={Menu01Icon}
                  className={cn(
                    "m-auto size-6 transition-all duration-200",
                    menuState
                      ? "rotate-180 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  )}
                />
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  className={cn(
                    "absolute inset-0 m-auto size-6 transition-all duration-200",
                    menuState
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-180 scale-0 opacity-0"
                  )}
                />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item) => {
                  const isActive = isActivePath(pathname ?? "", item.href)
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block hover:text-primary hover:font-semibold transition-all duration-300",
                          isActive ? "font-bold text-foreground" : "text-muted-foreground"
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => {
                    const isActive = isActivePath(pathname ?? "", item.href)
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "block hover:text-primary hover:font-semibold transition-all duration-300",
                            isActive ? "font-bold text-foreground" : "text-muted-foreground"
                          )}
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">
                    <span>Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
