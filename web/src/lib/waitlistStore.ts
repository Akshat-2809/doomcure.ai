"use client";

import { useSyncExternalStore } from "react";
import { waitlistSchema, type WaitlistSource } from "@/lib/waitlist/schema";

export type { WaitlistSource };
export type FormStatus = "idle" | "error";

type State = {
  /** Shared by both forms: once either succeeds, both show "You're on the list". */
  joined: boolean;
  forms: Record<WaitlistSource, { status: FormStatus; message: string }>;
};

const initial: State = {
  joined: false,
  forms: { hero: { status: "idle", message: "" }, cta: { status: "idle", message: "" } },
};

let state = initial;
const listeners = new Set<() => void>();

function set(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useWaitlist() {
  return useSyncExternalStore(subscribe, () => state, () => initial);
}

/** Front end only: validates in the browser and shows success. Nothing is sent or stored. */
export function joinWaitlist(source: WaitlistSource, email: string) {
  const parsed = waitlistSchema.safeParse({ email, source });
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Please check your email and try again.";
    set({ ...state, forms: { ...state.forms, [source]: { status: "error", message } } });
    return;
  }
  set({ ...state, joined: true, forms: { ...state.forms, [source]: { status: "idle", message: "" } } });
}
