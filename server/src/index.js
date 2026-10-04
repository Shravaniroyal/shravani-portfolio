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

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// --- Chat endpoint: the frontend sends the running conversation, gets a reply back ---
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

// --- Lead endpoint: visitor gave their name + email wanting contact ---
app.post("/api/lead", async (req, res) => {
  try {
    const { sessionId, name, email, context } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }
    logLead({ sessionId: sessionId || "unknown", name, email, context, ip: req.ip });
    try {
      await sendLeadEmail({ name, email, context });
    } catch (mailErr) {
      // Log the lead either way, but tell the truth about the email failing
      console.error("Email send failed:", mailErr.message);
      return res.json({
        ok: true,
        emailed: false,
        note: "Lead was logged, but the notification email failed to send. Check server/.env Gmail settings.",
      });
    }
    res.json({ ok: true, emailed: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong saving that." });
  }
});

// --- Admin: read-only view of all conversations and leads, passcode-protected ---
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
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Admin log viewer: http://localhost:${PORT}/admin.html`);
});
