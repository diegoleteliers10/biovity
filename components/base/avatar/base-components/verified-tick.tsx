"use client"

import { cx } from "@/lib/utils/cx"

const sizes = {
  xs: { root: "size-2.5", tick: "size-[4.38px" },
  sm: { root: "size-3", tick: "size-[5.25px]" },
  md: { root: "size-3.5", tick: "size-[6.13px]" },
  lg: { root: "size-4", tick: "size-[7px]" },
  xl: { root: "size-4.5", tick: "size-[7.88px]" },
  "2xl": { root: "size-5", tick: "size-[8.75px]" },
  "3xl": { root: "size-6", tick: "size-[10.5px]" },
  "4xl": { root: "size-8", tick: "size-[14px]" },
}

type VerifiedTickProps = {
  readonly size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"
  readonly className?: string
}

export const VerifiedTick = ({ size, className }: VerifiedTickProps) => (
  <svg
    data-verified
    className={cx("z-10 text-utility-blue-500", sizes[size].root, className)}
    viewBox="0 0 10 10"
    fill="none"
    aria-labelledby="verified-tick-title"
  >
    <title id="verified-tick-title">Verified tick</title>
    <path
      d="M7.7 1.8C7.8 2 8 2.2 8.2 2.3L9 2.6C9.3 2.7 9.4 2.9 9.5 3.1C9.6 3.3 9.6 3.6 9.5 3.8L9.2 4.6C9.1 4.9 9.1 5.1 9.2 5.4L9.5 6.2C9.6 6.3 9.6 6.4 9.6 6.5C9.6 6.6 9.6 6.8 9.5 6.9C9.5 7 9.4 7.1 9.3 7.2C9.3 7.3 9.1 7.3 9 7.4L8.2 7.7C8 7.8 7.8 8 7.7 8.2L7.4 9C7.3 9.3 7.1 9.4 6.9 9.5C6.7 9.6 6.4 9.6 6.2 9.5L5.4 9.2C5.1 9.1 4.9 9.1 4.6 9.2L3.8 9.5C3.6 9.6 3.3 9.6 3.1 9.5C2.9 9.4 2.7 9.3 2.6 9L2.3 8.2C2.2 8 2 7.8 1.8 7.7L1 7.4C0.7 7.3 0.6 7.1 0.5 6.9C0.4 6.7 0.4 6.4 0.5 6.2L0.8 5.4C0.9 5.1 0.9 4.9 0.8 4.6L0.5 3.8C0.4 3.7 0.4 3.6 0.4 3.5C0.4 3.4 0.4 3.2 0.5 3.1C0.5 3 0.6 2.9 0.7 2.8C0.7 2.7 0.9 2.7 1 2.6L1.8 2.3C2 2.2 2.2 2 2.3 1.8L2.6 1C2.7 0.7 2.9 0.6 3.1 0.5C3.3 0.4 3.6 0.4 3.8 0.5L4.6 0.8C4.9 0.9 5.1 0.9 5.4 0.8L6.2 0.5C6.4 0.4 6.7 0.4 6.9 0.5C7.1 0.6 7.3 0.7 7.4 1L7.7 1.8H7.7Z"
      className="fill-current"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 3.7C7 3.6 7 3.5 7 3.3C7 3.2 7 3.1 6.8 3C6.7 2.9 6.6 2.9 6.5 3L4.3 6.1L3.5 5C3.4 4.9 3.3 4.9 3.2 4.8C3.1 4.8 2.9 4.9 2.8 5C2.7 5.1 2.7 5.2 2.8 5.3L4 7.2C4.1 7.2 4.2 7.3 4.2 7.3C4.3 7.3 4.3 7.3 4.4 7.3C4.5 7.3 4.6 7.3 4.7 7.2L7 3.7Z"
      fill="white"
    />
  </svg>
)
