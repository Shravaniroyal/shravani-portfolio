import { SYSTEM_PROMPT } from "./groq.js";

function need(name) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is missing in server/.env`);
  return v;
}

// Clean the chat history so every provider accepts it:
// drop leading assistant messages (the greeting) and merge same-role neighbours.
function normalize(history) {
  const msgs = [];
  for (const h of history) {
    const role = h.role === "user" ? "user" : "assistant";
    if (msgs.length === 0 && role === "assistant") continue;
    const last = msgs[msgs.length - 1];
    if (last && last.role === role) last.content += "\n" + h.content;
    else msgs.push({ role, content: h.content });
  }
  return msgs;
}

async function post(url, headers, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} from ${new URL(url).host}: ${await res.text()}`);
  return res.json();
}

// Groq and OpenAI share the same request format.
async function openaiStyle(url, key, model, msgs) {
  const data = await post(url, { authorization: `Bearer ${key}` }, {
    model,
    max_tokens: 1500,
    temperature: 0.8,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...msgs],
  });
  return data.choices?.[0]?.message?.content;
}

async function claude(key, model, msgs) {
  const data = await post(
    "https://api.anthropic.com/v1/messages",
    { "x-api-key": key, "anthropic-version": "2023-06-01" },
    { model, max_tokens: 400, system: SYSTEM_PROMPT, messages: msgs }
  );
  return data.content?.find((b) => b.type === "text")?.text;
}

async function gemini(key, model, msgs) {
  const data = await post(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    { "x-goog-api-key": key },
    {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: msgs.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: 1024, temperature: 0.8 },
    }
  );
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("");
}

export async function askLLM(history) {
  const provider = (process.env.LLM_PROVIDER || "groq").toLowerCase();
  const msgs = normalize(history);
  let text;

  if (provider === "groq") {
    text = await openaiStyle("https://api.groq.com/openai/v1/chat/completions", need("GROQ_API_KEY"), need("GROQ_MODEL"), msgs);
  } else if (provider === "openai") {
    text = await openaiStyle("https://api.openai.com/v1/chat/completions", need("OPENAI_API_KEY"), need("OPENAI_MODEL"), msgs);
  } else if (provider === "claude") {
    text = await claude(need("ANTHROPIC_API_KEY"), need("CLAUDE_MODEL"), msgs);
  } else if (provider === "gemini") {
    text = await gemini(need("GEMINI_API_KEY"), need("GEMINI_MODEL"), msgs);
  } else {
    throw new Error(`Unknown LLM_PROVIDER "${provider}". Use groq, gemini, claude or openai.`);
  }

  return text?.trim() || "Sorry, I glitched for a second there!";
}