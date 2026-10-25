import "server-only";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/site";

/**
 * Sends the welcome email and the internal notification.
 * Never throws: email problems are logged and must not fail the signup.
 */
export async function sendWaitlistEmails(signup: { id: number; email: string; source: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const notify = process.env.NOTIFY_EMAIL;
  if (!apiKey || !from) {
    console.warn(`[waitlist] #${signup.id}: RESEND_API_KEY or EMAIL_FROM not set, skipping emails`);
    return;
  }
  const resend = new Resend(apiKey);

  const jobs: Promise<unknown>[] = [
    resend.emails.send(
      {
        from,
        to: signup.email,
        replyTo: CONTACT_EMAIL,
        subject: "You're on the list",
        text: ["You're on the list. More on this soon.", "", "— Doomcure", "https://doomcure.com"].join("\n"),
        html: `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#141414">
<p style="margin:0 0 12px"><strong>You're on the list.</strong> More on this soon.</p>
<p style="margin:0;color:#55554F">Doomcure · <a href="https://doomcure.com" style="color:#141414">doomcure.com</a></p>
</div>`,
      },
      { idempotencyKey: `waitlist-welcome/${signup.id}` },
    ),
  ];

  if (notify) {
    jobs.push(
      resend.emails.send(
        {
          from,
          to: notify,
          replyTo: signup.email,
          subject: `New waitlist signup (${signup.source})`,
          text: `${signup.email} joined the waitlist from the ${signup.source} form.`,
        },
        { idempotencyKey: `waitlist-notify/${signup.id}` },
      ),
    );
  } else {
    console.warn(`[waitlist] #${signup.id}: NOTIFY_EMAIL not set, skipping internal notification`);
  }

  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    if (r.status === "rejected") {
      console.error(`[waitlist] #${signup.id}: email failed`, r.reason);
    } else {
      const { error } = r.value as { error: unknown };
      if (error) console.error(`[waitlist] #${signup.id}: email rejected by Resend`, error);
    }
  }
}
