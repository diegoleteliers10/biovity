"use client"

import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
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
    <header className="contents">
      <nav
        data-state={menuState ? "open" : "closed"}
        className="fixed z-20 w-full px-4 lg:px-2 lg:contain-paint"
      >
        <div className="mx-auto mt-4 max-w-4xl rounded-2xl border bg-background/50 px-6 backdrop-blur-lg transition-all duration-300 lg:px-5">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center gap-2">
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
                <span className="relative block size-6" aria-hidden>
                  <m.span
                    initial={false}
                    animate={{
                      opacity: menuState ? 0 : 1,
                      scale: menuState ? 0.25 : 1,
                      filter: menuState ? "blur(4px)" : "blur(0px)",
                      rotate: menuState ? -90 : 0,
                    }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    className="absolute inset-0 flex items-center justify-center will-change-transform"
                  >
                    <HugeiconsIcon icon={Menu01Icon} className="size-6" />
                  </m.span>
                  <m.span
                    initial={false}
                    animate={{
                      opacity: menuState ? 1 : 0,
                      scale: menuState ? 1 : 0.25,
                      filter: menuState ? "blur(0px)" : "blur(4px)",
                      rotate: menuState ? 0 : 90,
                    }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    className="absolute inset-0 flex items-center justify-center will-change-transform"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-6" />
                  </m.span>
                </span>
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

            <div
              className={cn(
                "mb-6 w-full flex-wrap items-start justify-start space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:justify-end lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent",
                !menuState ? "hidden" : "flex"
              )}
            >
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
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-3 md:w-fit">
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
