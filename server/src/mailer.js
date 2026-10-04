import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER / GMAIL_APP_PASSWORD not set in server/.env — see .env.example"
    );
  }
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

export async function sendLeadEmail({ name, email, context }) {
  const to = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER;
  const t = getTransporter();

  await t.sendMail({
    from: `"Shravani's AI Avatar" <${process.env.GMAIL_USER}>`,
    to,
    subject: `New contact request from ${name}`,
    text: [
      `${name} wants to get in touch with you.`,
      `Their email: ${email}`,
      ``,
      `Conversation context:`,
      context || "(no context captured)",
    ].join("\n"),
  });
}
