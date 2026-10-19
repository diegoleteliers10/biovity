import Image from "next/image"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AuthPageShellProps = {
  children: ReactNode
  imageAlt: string
  imageClassName?: string
  imageSrc: string
}

export function AuthPageShell({
  children,
  imageAlt,
  imageClassName,
  imageSrc,
}: AuthPageShellProps) {
  return (
    <main className="grid h-dvh overflow-hidden bg-surface-container-low lg:grid-cols-[minmax(20rem,0.82fr)_minmax(0,1.18fr)]">
      <div className="relative hidden h-full overflow-hidden bg-surface-container-low lg:block">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={cn("object-cover object-center", imageClassName)}
          priority
          sizes="42vw"
        />
      </div>

      <section className="h-full min-h-0 overflow-y-auto bg-surface-container-lowest">
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-14 xl:px-20">
          <div className="my-auto w-full py-4 sm:py-6">{children}</div>
        </div>
      </section>
    </main>
  )
}
