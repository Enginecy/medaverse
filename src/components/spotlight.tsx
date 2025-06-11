"use client";

import { cn } from "@/lib/utils";
import React, { type MouseEvent, useRef, useState } from "react";

export default function Spotlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: React.ComponentProps<"div">["className"];
}) {
  const boxWrapper = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = React.useState<{
    x: number | null;
    y: number | null;
  }>({
    x: null,
    y: null,
  });

  React.useEffect(() => {
    const updateMousePosition = (e: globalThis.MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const [overlayColor, setOverlayColor] = useState({ x: 0, y: 0 });
  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;

    setOverlayColor({ x, y });
  };

  return (
    <div className={cn("relative rounded-2xl bg-white", className)}>
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={boxWrapper}
        className={cn(
          "group relative overflow-hidden rounded-2xl bg-[#24587033]",
        )}
      >
        {isHovered && (
          <div
            className="pointer-events-none absolute z-50 h-full w-full rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: `
            radial-gradient(
              250px circle at ${overlayColor.x}px ${overlayColor.y}px,
              rgba(51, 91, 198, 0.1) 20.32%,
              rgba(255, 255, 255, 0) 79.68%
            )
          `,
            }}
          />
        )}

        <div
          className="absolute inset-0 z-0 rounded-2xl bg-fixed"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(51, 91, 198, 0.1) 0%,transparent 20%,transparent) fixed`,
          }}
        ></div>

        <div className="relative z-10 rounded-2xl border border-blue-100 bg-[#ffffffe9] bg-cover p-6 text-center shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
