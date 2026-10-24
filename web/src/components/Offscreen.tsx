"use client";

import { useEffect, useRef } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode };

/**
 * A div that sets `data-offscreen` while it is outside the viewport.
 * globals.css pauses every CSS animation inside it, so looping
 * animations (marquee, feeds, grain) don't run when nobody can see them.
 */
export function Offscreen({ children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      el.toggleAttribute("data-offscreen", !entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
