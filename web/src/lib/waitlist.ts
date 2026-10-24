"use client";

import { useSyncExternalStore } from "react";

export type WaitlistSource = "hero" | "cta";
export type FormStatus = "idle" | "submitting" | "error";

type State = {
  /** Shared by both forms: once either succeeds, both show "You're on the list". */
  joined: boolean;
  forms: Record<WaitlistSource, { status: FormStatus; message: string }>;
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

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

function messageFor(status: number) {
  if (status === 400) return "That email doesn't look quite right. Check it and try again.";
  if (status === 429) return "Too many tries from this connection. Wait a few minutes and try again.";
  return "Something went wrong on our side, so you're not on the list yet. Please try again.";
}

export async function joinWaitlist(source: WaitlistSource, email: string, website: string) {
  if (state.forms[source].status === "submitting") return;
  setForm(source, "submitting");
  try {
    const res = await fetch(`${API_URL}/v1/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source, website }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      setForm(source, "error", messageFor(res.status));
      return;
    }
    set({ ...state, joined: true, forms: { ...state.forms, [source]: { status: "idle", message: "" } } });
  } catch {
    setForm(source, "error", "We couldn't reach the server. Check your connection and try again.");
  }
}
