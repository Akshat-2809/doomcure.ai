"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_FIELDS, contactSchema, type ContactField, type ContactState } from "@/lib/contact/schema";
import s from "./Contact.module.css";

/** Front end only: validates in the browser and shows success. Nothing is sent or stored. */
export function ContactForm() {
  const [state, setState] = useState<ContactState>({ status: "idle" });
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "success") doneRef.current?.focus();
  }, [state]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    });
    if (parsed.success) {
      setState({ status: "success" });
      return;
    }
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField;
      if (CONTACT_FIELDS.includes(key) && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    setState({ status: "error", message: "Please check the highlighted fields and try again.", fieldErrors });
  }

  if (state.status === "success") {
    return (
      <div className={s.done} ref={doneRef} tabIndex={-1} role="status">
        <div className={s.burst} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <span className={s.tick} aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
        </span>
        <strong className={s.doneTitle}>Message sent.</strong>
        <span>Thanks for writing. We&apos;ll reply by email.</span>
      </div>
    );
  }

  const err = state.status === "error" ? state : null;
  const fieldError = (f: ContactField) => err?.fieldErrors[f];
  const describe = (f: ContactField) => (fieldError(f) ? `c-${f}-err` : undefined);

  return (
    <form onSubmit={onSubmit} className={s.form} noValidate>
      <p className="sr-only" aria-live="polite" role="status">
        {err ? err.message : ""}
      </p>

      <div className={s.two}>
        <div className={s.field}>
          <label htmlFor="c-name">Name</label>
          <input id="c-name" name="name" type="text" autoComplete="name" placeholder="Your name" required maxLength={120}
            aria-invalid={!!fieldError("name")} aria-describedby={describe("name")} />
          {fieldError("name") && <span id="c-name-err" className={s.ferr}>{fieldError("name")}</span>}
        </div>
        <div className={s.field}>
          <label htmlFor="c-email">Email</label>
          <input id="c-email" name="email" type="email" autoComplete="email" placeholder="you@email.com" required maxLength={254}
            aria-invalid={!!fieldError("email")} aria-describedby={describe("email")} />
          {fieldError("email") && <span id="c-email-err" className={s.ferr}>{fieldError("email")}</span>}
        </div>
      </div>

      <div className={s.field}>
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" rows={6} placeholder="What's on your mind?" required maxLength={5000}
          aria-invalid={!!fieldError("message")} aria-describedby={describe("message")} />
        {fieldError("message") && <span id="c-message-err" className={s.ferr}>{fieldError("message")}</span>}
      </div>

      <div className={s.actions}>
        <button type="submit" className="btn btn-ink">
          Send message
        </button>
        <span className={s.fine}>We&apos;ll only use your details to reply.</span>
      </div>
    </form>
  );
}
