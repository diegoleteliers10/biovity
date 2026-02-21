"use client";

import { useRef } from "react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Circle } from "@/components/common/Circle";
import { UserIcon, Building05Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function AdnBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full max-w-[700px] items-center justify-center overflow-hidden p-12"
      ref={containerRef}
    >
      <div className="flex size-full flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row justify-between">
          <Circle ref={div1Ref} className="size-20">
            <HugeiconsIcon icon={UserIcon} size={42} />
          </Circle>
          <Circle ref={div2Ref} className="size-20">
            <HugeiconsIcon icon={Building05Icon} size={42} />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startYOffset={-10}
        endYOffset={10}
        curvature={-80}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startYOffset={10}
        endYOffset={-10}
        curvature={80}
        reverse
      />
    </div>
  );
}
