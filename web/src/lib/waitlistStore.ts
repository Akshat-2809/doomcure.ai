"use client";

import { useSyncExternalStore } from "react";
import { joinWaitlist as joinWaitlistAction } from "@/app/actions/waitlist";
import type { WaitlistSource } from "@/lib/waitlist/schema";

export type { WaitlistSource };
export type FormStatus = "idle" | "submitting" | "error";

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

function setForm(source: WaitlistSource, status: FormStatus, message = "") {
  set({ ...state, forms: { ...state.forms, [source]: { status, message } } });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useWaitlist() {
  return useSyncExternalStore(subscribe, () => state, () => initial);
}

export async function joinWaitlist(source: WaitlistSource, email: string, website: string) {
  if (state.forms[source].status === "submitting") return;
  setForm(source, "submitting");
  try {
    const result = await joinWaitlistAction({ email, source, website });
    if (result.status === "error") {
      setForm(source, "error", result.message);
      return;
    }
    set({ ...state, joined: true, forms: { ...state.forms, [source]: { status: "idle", message: "" } } });
  } catch {
    setForm(source, "error", "We couldn't reach the server. Check your connection and try again.");
  }
}
