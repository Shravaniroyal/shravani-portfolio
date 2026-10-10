import nodemailer from "nodemailer";

// Sends the "someone wants to contact you" email.
// - If RESEND_API_KEY is set (use this on Render), it sends over HTTPS with Resend.
//   Render's free tier often blocks Gmail's SMTP port, so Resend is the reliable option online.
// - Otherwise it falls back to Gmail (works fine on your own computer).

function buildMessage({ name, email, context }) {
  const subject = `New contact from your portfolio chat: ${name}`;
  const text =
    `Someone wants to get in touch with you.\n\n` +
    `Name: ${name}\n` +
    `Contact: ${email}\n\n` +
    `Details:\n${context || "(none)"}\n\n` +
    `Reply to them within 24 hours, as the chat promised.`;
  return { subject, text };
}

async function sendWithResend({ name, email, context }) {
  const { subject, text } = buildMessage({ name, email, context });
  const to = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "Portfolio Chat <onboarding@resend.dev>",
      to: [to],
      reply_to: email && email.includes("@") ? email : undefined,
      subject,
      text,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}

async function sendWithGmail({ name, email, context }) {
  const { subject, text } = buildMessage({ name, email, context });
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  await transporter.sendMail({
    from: `"Portfolio Chat" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
    replyTo: email && email.includes("@") ? email : undefined,
    subject,
    text,
  });
}

export async function sendLeadEmail(lead) {
  if (process.env.RESEND_API_KEY) return sendWithResend(lead);
  return sendWithGmail(lead);
}