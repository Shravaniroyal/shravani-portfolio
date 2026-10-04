import "dotenv/config";
import { askLLM } from "./llm.js";

const provider = (process.env.LLM_PROVIDER || "groq").toLowerCase();

const lists = {
  groq: () => ["https://api.groq.com/openai/v1/models", { authorization: `Bearer ${process.env.GROQ_API_KEY}` }],
  openai: () => ["https://api.openai.com/v1/models", { authorization: `Bearer ${process.env.OPENAI_API_KEY}` }],
  claude: () => ["https://api.anthropic.com/v1/models", { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" }],
  gemini: () => ["https://generativelanguage.googleapis.com/v1beta/models?pageSize=100", { "x-goog-api-key": process.env.GEMINI_API_KEY }],
};

console.log(`Provider: ${provider}\n`);

try {
  const [url, headers] = lists[provider]();
  const res = await fetch(url, { headers });
  const body = await res.text();
  if (!res.ok) {
    console.log(`Could not list models (HTTP ${res.status}). The key itself is probably invalid or blocked:\n${body}\n`);
  } else {
    const data = JSON.parse(body);
    const ids = (data.data || data.models || []).map((m) => m.id || (m.name || "").replace("models/", ""));
    console.log("Models this key can use:\n  " + ids.join("\n  ") + "\n");
    console.log("Copy one of those names into the *_MODEL line in server/.env\n");
  }
} catch (e) {
  console.log("List step failed:", e.message, "\n");
}

try {
  const reply = await askLLM([{ role: "user", content: "Say hi in five words." }]);
  console.log("TEST REPLY:", reply);
  console.log("\nEverything works. Restart the server and chat.");
} catch (e) {
  console.log("TEST CHAT FAILED:", e.message);
}