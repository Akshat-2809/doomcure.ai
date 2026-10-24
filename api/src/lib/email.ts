import { Resend } from "resend";
import { env } from "../env.js";
import { logger } from "../logger.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const welcomeText = "You're on the list. More on this soon.\n\nDoomcure\nhttps://doomcure.com";
const welcomeHtml = `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#141414">
<p style="margin:0 0 12px"><strong>You're on the list.</strong> More on this soon.</p>
<p style="margin:0;color:#55554F">Doomcure · <a href="https://doomcure.com" style="color:#141414">doomcure.com</a></p>
</div>`;

/**
 * Welcome email to the new signup plus a notification to NOTIFY_EMAIL.
 * Never throws: email problems are logged and must not fail the signup.
 */
export async function sendSignupEmails(email: string, source: string): Promise<void> {
  if (!resend) {
    logger.warn("RESEND_API_KEY is not set; skipping waitlist emails");
    return;
  }

  const jobs = [
    resend.emails.send({ from: env.EMAIL_FROM, to: email, subject: "You're on the list", text: welcomeText, html: welcomeHtml }),
  ];
  if (env.NOTIFY_EMAIL) {
    jobs.push(
      resend.emails.send({
        from: env.EMAIL_FROM,
        to: env.NOTIFY_EMAIL,
        subject: `New waitlist signup (${source})`,
        text: `${email} joined the waitlist from the ${source} form.`,
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r, i) => {
    const kind = i === 0 ? "welcome" : "notify";
    if (r.status === "rejected") logger.error({ err: r.reason, kind }, "email send threw");
    else if (r.value.error) logger.error({ err: r.value.error, kind }, "email send failed");
  });
}
