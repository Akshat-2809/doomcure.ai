"use client";

import { useSyncExternalStore } from "react";

/** Metres per CSS pixel (1px = 0.2646mm). */
export const METRES_PER_PX = 0.0002646;

// Total absolute distance scrolled on this page, in px.
let px = 0;
let lastTop = 0;
let pending = 0;
let frame = 0;
const listeners = new Set<() => void>();

function onScroll() {
  const top = window.scrollY;
  pending += Math.abs(top - lastTop);
  lastTop = top;
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const add = pending;
    pending = 0;
    if (add > 0) {
      px += add;
      listeners.forEach((l) => l());
    }
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    lastTop = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

/** Pixels scrolled on this page so far (shared by the Problem meter and the pill). */
export function useScrolledPx() {
  return useSyncExternalStore(subscribe, () => px, () => 0);
}

export function formatMetres(value: number) {
  return (value * METRES_PER_PX).toFixed(2);
}
