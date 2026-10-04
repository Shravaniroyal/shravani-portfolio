import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(__dirname, "..", "logs");
const CHAT_LOG = path.join(LOG_DIR, "chats.jsonl");
const LEAD_LOG = path.join(LOG_DIR, "leads.jsonl");

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
for (const f of [CHAT_LOG, LEAD_LOG]) {
  if (!fs.existsSync(f)) fs.writeFileSync(f, "");
}

function appendLine(file, obj) {
  fs.appendFileSync(file, JSON.stringify(obj) + "\n", "utf8");
}

function readLines(file) {
  const raw = fs.readFileSync(file, "utf8").trim();
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// Logs one exchange: the visitor's message and the bot's reply.
export function logChatTurn({ sessionId, visitorMessage, botReply, ip }) {
  appendLine(CHAT_LOG, {
    ts: new Date().toISOString(),
    sessionId,
    visitorMessage,
    botReply,
    ip: ip || null,
  });
}

// Logs a completed lead (someone who asked to be contacted and gave their info).
export function logLead({ sessionId, name, email, context, ip }) {
  appendLine(LEAD_LOG, {
    ts: new Date().toISOString(),
    sessionId,
    name,
    email,
    context,
    ip: ip || null,
  });
}

export function getAllChats() {
  return readLines(CHAT_LOG).reverse(); // newest first
}

export function getAllLeads() {
  return readLines(LEAD_LOG).reverse();
}

// Groups flat chat turns back into conversations by sessionId, for easier reading.
export function getConversations() {
  const turns = readLines(CHAT_LOG);
  const bySession = {};
  for (const t of turns) {
    if (!bySession[t.sessionId]) bySession[t.sessionId] = [];
    bySession[t.sessionId].push(t);
  }
  return Object.entries(bySession)
    .map(([sessionId, turns]) => ({
      sessionId,
      startedAt: turns[0]?.ts,
      lastMessageAt: turns[turns.length - 1]?.ts,
      turnCount: turns.length,
      turns,
    }))
    .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
}
