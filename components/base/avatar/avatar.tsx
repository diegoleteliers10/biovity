"use client"

import Image from "next/image"
import { UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type FC, type ReactNode, useState } from "react"
import { cx } from "@/lib/utils/cx"
import { AvatarOnlineIndicator, VerifiedTick } from "./base-components"

type AvatarSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export interface AvatarProps {
  size?: AvatarSize
  className?: string
  src?: string | null
  alt?: string
  /**
   * Display a contrast border around the avatar.
   */
  contrastBorder?: boolean
  /**
   * Display a badge (i.e. company logo).
   */
  badge?: ReactNode
  /**
   * Display a status indicator.
   */
  status?: "online" | "offline"
  /**
   * Display a verified tick icon.
   *
   * @default false
   */
  verified?: boolean

  /**
   * The initials of the user to display if no image is available.
   */
  initials?: string
  /**
   * An icon to display if no image is available.
   */
  placeholderIcon?: FC<{ className?: string }>
  /**
   * A placeholder to display if no image is available.
   */
  placeholder?: ReactNode

  /**
   * Whether the avatar should show a focus ring when the parent group is in focus.
   * For example, when the avatar is wrapped inside a link.
   *
   * @default false
   */
  focusable?: boolean
}

type AvatarMainContentProps = {
  src?: string | null
  alt?: string
  initials?: string
  placeholder?: ReactNode
  placeholderIcon?: FC<{ className?: string }>
  size: AvatarSize
  isFailed: boolean
  onImageError: () => void
}

const AvatarMainContent = ({
  src,
  alt,
  initials,
  placeholder,
  placeholderIcon: PlaceholderIcon,
  size,
  isFailed,
  onImageError,
}: AvatarMainContentProps) => {
  if (src && !isFailed) {
    return (
      <Image
        data-avatar-img
        src={src}
        alt={alt ?? ""}
        width={256}
        height={256}
        className="size-full rounded-full object-cover"
        onError={onImageError}
        unoptimized
      />
    )
  }
  if (initials) {
    return <span className={cx("text-quaternary", styles[size].initials)}>{initials}</span>
  }
  if (PlaceholderIcon) {
    return <PlaceholderIcon className={cx("text-fg-quaternary", styles[size].icon)} />
  }
  return (
    placeholder || (
      <HugeiconsIcon icon={UserIcon} className={cx("text-fg-quaternary", styles[size].icon)} />
    )
  )
}

type AvatarBadgeContentProps = {
  status?: "online" | "offline"
  verified?: boolean
  badge?: ReactNode
  size: AvatarSize
}

const AvatarBadgeContent = ({ status, verified, badge, size }: AvatarBadgeContentProps) => {
  if (status) {
    return <AvatarOnlineIndicator status={status} size={size === "xxs" ? "xs" : size} />
  }
  if (verified) {
    return (
      <VerifiedTick
        size={size === "xxs" ? "xs" : size}
        className={cx(
          "absolute right-0 bottom-0",
          (size === "xxs" || size === "xs") && "-right-px -bottom-px"
        )}
      />
    )
  }
  return badge
}

const styles = {
  xxs: {
    root: "size-4 outline-[0.5px] -outline-offset-[0.5px]",
    initials: "text-xs font-semibold",
    icon: "size-3",
  },
  xs: {
    root: "size-6 outline-[0.5px] -outline-offset-[0.5px]",
    initials: "text-xs font-semibold",
    icon: "size-4",
  },
  sm: {
    root: "size-8 outline-[0.75px] -outline-offset-[0.75px]",
    initials: "text-sm font-semibold",
    icon: "size-5",
  },
  md: {
    root: "size-10 outline-1 -outline-offset-1",
    initials: "text-md font-semibold",
    icon: "size-6",
  },
  lg: {
    root: "size-12 outline-1 -outline-offset-1",
    initials: "text-lg font-semibold",
    icon: "size-7",
  },
  xl: {
    root: "size-14 outline-1 -outline-offset-1",
    initials: "text-xl font-semibold",
    icon: "size-8",
  },
  "2xl": {
    root: "size-16 outline-1 -outline-offset-1",
    initials: "text-display-xs font-semibold",
    icon: "size-8",
  },
}

export const Avatar = ({
  contrastBorder = true,
  size = "md",
  src,
  alt,
  initials,
  placeholder,
  placeholderIcon: PlaceholderIcon,
  badge,
  status,
  verified,
  focusable = false,
  className,
}: AvatarProps) => {
  const [isFailed, setIsFailed] = useState(false)

  return (
    <div
      data-avatar
      className={cx(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-avatar-bg outline-transparent",
        // Focus styles
        focusable &&
          "group-outline-focus-ring group-focus-visible:outline-2 group-focus-visible:outline-offset-2",
        contrastBorder && "outline outline-avatar-contrast-border",
        styles[size].root,
        className
      )}
    >
      <AvatarMainContent
        src={src}
        alt={alt}
        initials={initials}
        placeholder={placeholder}
        placeholderIcon={PlaceholderIcon}
        size={size}
        isFailed={isFailed}
        onImageError={() => setIsFailed(true)}
      />
      <AvatarBadgeContent status={status} verified={verified} badge={badge} size={size} />
    </div>
  )
}
