import "server-only";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/site";

type Message = { id: number; name: string; email: string; message: string };

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Forwards the message to NOTIFY_EMAIL and sends the sender a short acknowledgement.
 * Never throws: email problems are logged and must not fail the request.
 */
export async function sendContactEmails(msg: Message) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const notify = process.env.NOTIFY_EMAIL;
  if (!apiKey || !from) {
    console.warn(`[contact] #${msg.id}: RESEND_API_KEY or EMAIL_FROM not set, skipping emails`);
    return;
  }
  const resend = new Resend(apiKey);
  const jobs: Promise<unknown>[] = [];

  if (notify) {
    jobs.push(
      resend.emails.send(
        {
          from,
          to: notify,
          replyTo: msg.email,
          subject: `Contact form: ${msg.name}`,
          text: [`From: ${msg.name} <${msg.email}>`, "", msg.message].join("\n"),
          html: `<p><b>From:</b> ${escape(msg.name)} &lt;${escape(msg.email)}&gt;</p><p style="white-space:pre-wrap">${escape(msg.message)}</p>`,
        },
        { idempotencyKey: `contact-notify/${msg.id}` },
      ),
    );
  } else {
    console.warn(`[contact] #${msg.id}: NOTIFY_EMAIL not set, skipping internal notification`);
  }

  jobs.push(
    resend.emails.send(
      {
        from,
        to: msg.email,
        replyTo: CONTACT_EMAIL,
        subject: "We've got your message",
        text: [
          `Hi ${msg.name},`,
          "",
          "Thanks for writing to Doomcure. We've got your message and will reply by email.",
          "",
          "— Doomcure",
          CONTACT_EMAIL,
        ].join("\n"),
      },
      { idempotencyKey: `contact-ack/${msg.id}` },
    ),
  );

  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    if (r.status === "rejected") {
      console.error(`[contact] #${msg.id}: email failed`, r.reason);
    } else {
      const { error } = r.value as { error: unknown };
      if (error) console.error(`[contact] #${msg.id}: email rejected by Resend`, error);
    }
  }
}
