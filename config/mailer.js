// config/mailer.js
import { Resend } from "resend";

export const getSenderEmail = () =>
  process.env.EMAIL_FROM || "onboarding@resend.dev";

export const getSenderName = () =>
  process.env.MAIL_FROM_NAME || "Shubham Maurya";

/**
 * Get or instantiate Resend instance dynamically at runtime
 */
const getResendClient = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[Mailer] RESEND_API_KEY is missing in environment variables.");
    return null;
  }
  return new Resend(key);
};

/**
 * Single email sender
 */
const transporter = {
  sendMail: async ({ from, to, subject, html }) => {
    const resend = getResendClient();
    if (!resend) {
      console.warn("[Mailer] Skipping email send because RESEND_API_KEY is not set.");
      return null;
    }

    const sender = from || `${getSenderName()} <${getSenderEmail()}>`;
    const recipients = Array.isArray(to) ? to : [to];
    const results = [];

    for (const recipient of recipients) {
      const { data, error } = await resend.emails.send({
        from: sender,
        to: recipient,
        subject,
        html,
      });

      if (error) {
        console.error("[Mailer Error]", error);
        throw new Error(error.message || JSON.stringify(error));
      }

      results.push(data);

      if (recipients.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return results.length === 1 ? results[0] : results;
  },
};

/**
 * Batch email sender (or fallback to individual sends)
 */
export const batchSend = async (emails) => {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[Mailer] Skipping batch email send because RESEND_API_KEY is not set.");
    return null;
  }

  const sender = `${getSenderName()} <${getSenderEmail()}>`;

  const prepared = emails.map((e) => ({
    from: e.from || sender,
    ...e,
  }));

  const { data, error } = await resend.batch.send(prepared);

  if (error) {
    console.error("[Mailer Batch Error]", error);
    throw new Error(error.message || JSON.stringify(error));
  }

  return data;
};

export default transporter;
