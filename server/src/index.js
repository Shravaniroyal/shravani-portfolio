import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { askGroq } from "./groq.js";
import { sendLeadEmail } from "./mailer.js";
import {
  logChatTurn,
  logLead,
  getConversations,
  getAllLeads,
} from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Render sits behind a proxy, so this makes req.ip the visitor's real address
app.set("trust proxy", 1);

// CORS: set CLIENT_ORIGIN on Render to your Vercel URL (comma-separate several).
// Locally (variable not set) any origin is allowed so dev keeps working.
const allowed = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowed.length === 0 || allowed.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

// Health check (also useful for waking the free Render server)
app.get("/api/health", (req, res) => res.json({ ok: true }));

// --- Chat endpoint ---
app.post("/api/chat", async (req, res) => {
  try {
    const { history, sessionId } = req.body;
    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: "history array is required" });
    }
    const reply = await askGroq(history);
    const lastVisitorMsg = [...history].reverse().find((h) => h.role === "user");
    logChatTurn({
      sessionId: sessionId || "unknown",
      visitorMessage: lastVisitorMsg?.content || "",
      botReply: reply,
      ip: req.ip,
    });
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong generating a reply." });
  }
});

// --- Lead endpoint ---
app.post("/api/lead", async (req, res) => {
  try {
    const { sessionId, name, email, linkedin, context, purpose, company } = req.body;
    if (!name || (!email && !linkedin)) {
      return res.status(400).json({ error: "name and an email or LinkedIn link are required" });
    }
    // Keep purpose, company and LinkedIn in the saved lead and the email
    const fullContext = [
      purpose ? `Purpose: ${purpose}` : "",
      company ? `Company: ${company}` : "",
      linkedin ? `LinkedIn: ${linkedin}` : "",
      context || "",
    ]
      .filter(Boolean)
      .join(" | ");

    // If the visitor gave only LinkedIn, there is no email to reply to, so use
    // your own address as the reply address and show the LinkedIn link in the name line.
    const ownAddress = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || "";
    const emailForMail = email || ownAddress;
    const nameForMail = email ? name : `${name} (contact on LinkedIn: ${linkedin})`;

    logLead({ sessionId: sessionId || "unknown", name, email: email || linkedin, context: fullContext, ip: req.ip });
    try {
      await sendLeadEmail({ name: nameForMail, email: emailForMail, context: fullContext });
    } catch (mailErr) {
      console.error("Email send failed:", mailErr.message);
      return res.json({
        ok: true,
        emailed: false,
        note: "Lead was logged, but the notification email failed to send. Check the email settings.",
      });
    }
    res.json({ ok: true, emailed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong saving that." });
  }
});

// --- Admin (passcode-protected) ---
function checkPasscode(req, res, next) {
  const provided = req.query.key || req.headers["x-admin-key"];
  if (!process.env.ADMIN_PASSCODE || provided !== process.env.ADMIN_PASSCODE) {
    return res.status(401).json({ error: "Invalid or missing admin key" });
  }
  next();
}

app.get("/api/admin/conversations", checkPasscode, (req, res) => {
  res.json(getConversations());
});

app.get("/api/admin/leads", checkPasscode, (req, res) => {
  res.json(getAllLeads());
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});