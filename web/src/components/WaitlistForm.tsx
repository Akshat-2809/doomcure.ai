"use client";

import { useState } from "react";
import { joinWaitlist, useWaitlist, type WaitlistSource } from "@/lib/waitlist";
import styles from "./WaitlistForm.module.css";

type Props = { source: WaitlistSource; buttonLabel: string; full?: boolean };

const SUCCESS = "You're on the list. More on this soon.";

export function WaitlistForm({ source, buttonLabel, full }: Props) {
  const { joined, forms } = useWaitlist();
  const { status, message } = forms[source];
  const [submittedHere, setSubmittedHere] = useState(false);
  const inputId = `${source}-email`;
  const errorId = `${source}-error`;

  // Only the form the visitor used announces the result.
  const live = status === "submitting" ? "Joining the waitlist…" : status === "error" ? message : joined && submittedHere ? SUCCESS : "";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmittedHere(true);
    void joinWaitlist(source, String(data.get("email") ?? ""), String(data.get("website") ?? ""));
  }

  return (
    <>
      <p className="sr-only" aria-live="polite" role="status">{live}</p>
      {!joined ? (
        <>
          <form className={styles.wl} style={full ? { width: "100%" } : undefined} onSubmit={onSubmit}>
            <label htmlFor={inputId} className="sr-only">Email address</label>
            <input
              id={inputId}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              required
              aria-invalid={status === "error" || undefined}
              aria-describedby={status === "error" ? errorId : undefined}
            />
            <div className={styles.hp} aria-hidden="true">
              <label htmlFor={`${source}-website`}>Website</label>
              <input id={`${source}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <button type="submit" className="btn btn-ink" disabled={status === "submitting"}>
              {status === "submitting" && <span className={styles.spin} aria-hidden="true" />}
              {buttonLabel}
            </button>
          </form>
          {status === "error" && (
            <p id={errorId} className={styles.err}>{message}</p>
          )}
        </>
      ) : source === "hero" ? (
        <div className={`${styles.wl} ${styles.joined}`}>
          <strong>You&apos;re on the list.</strong>
          <span style={{ color: "var(--ink2)" }}>More on this soon.</span>
        </div>
      ) : (
        <div className={styles.done}>
          <div className={styles.burst} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <span className={styles.tick}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
          </span>
          <strong style={{ fontFamily: "var(--disp)", fontSize: 32, fontWeight: 400 }}>You&apos;re on the list.</strong>
          <span>More on this soon.</span>
        </div>
      )}
    </>
  );
}
