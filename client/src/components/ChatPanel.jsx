import React, { useEffect, useRef, useState } from "react";

const API = import.meta.env.VITE_API_URL || "";
const CONTACT_RE =
  /\b(talk to (your )?(owner|creator|her)|contact (you|her)|reach (you|her)|get (her |you )?in touch|in touch with (her|you)|(how|can|could) (do |can |could |to )?(i|we) (contact|reach|message|email|meet|talk to)|connect (me )?(with|to) (you|her)|hire (her|you)|speak (to|with) (her|you)|email her|her email|her contact)\b/i;
const BYE_RE =
  /\b(bye|goodbye|see you|see ya|gotta go|have to go|that'?s all|that is all|thanks a lot|thank you so much|thanks,? bye|ok thanks|okay thanks|thank you)\b/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "why should we hire her?" is a question to answer, not a request to contact her
const WHY_RE = /\b(why|should|reasons?|worth|good fit|what makes)\b/i;
function wantsContact(text) {
  return CONTACT_RE.test(text) && !WHY_RE.test(text);
}

function guessPurpose(text) {
  if (/intern/i.test(text)) return "Internship opportunity";
  if (/job|hire|hiring|full.?time|role|position|opening/i.test(text)) return "Job opportunity";
  return "General inquiry";
}

function makeSessionId() {
  return "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const PURPOSES = ["Internship opportunity", "Job opportunity", "General inquiry"];

export default function ChatPanel({ onFarewellTriggered, onGreetShown, incoming }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Shravani's AI twin 👋 Ask me anything about her — or even who built me 👀 You can also say \"connect me with her\" right here, and I'll pass your details to her so she can contact you back.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  // chat | ask_purpose | ask_company | ask_name | ask_email
  const [stage, setStage] = useState("chat");
  const [purpose, setPurpose] = useState("");
  const [company, setCompany] = useState("");
  const [leadName, setLeadName] = useState("");
  const sessionId = useRef(makeSessionId());
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, stage]);

  function addBot(content) {
    setMessages((m) => [...m, { role: "assistant", content }]);
  }

  async function callChatOnce(history) {
    const res = await fetch(`${API}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ history, sessionId: sessionId.current }),
    });
    if (!res.ok) throw new Error("chat failed");
    const data = await res.json();
    return data.reply;
  }

  // retry once so a one-off first-request failure doesn't show the glitch message
  async function callChat(history) {
    try {
      return await callChatOnce(history);
    } catch {
      await new Promise((r) => setTimeout(r, 800));
      return await callChatOnce(history);
    }
  }

  async function sendLead(name, email) {
    const chatContext = messages
      .slice(-8)
      .map((m) => (m.role === "user" ? "Visitor: " : "Bot: ") + m.content)
      .join("\n");
    const context =
      `Purpose: ${purpose}\nCompany: ${company}\n\nRecent chat:\n` + chatContext;
    try {
      await fetch(`${API}/api/lead`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          name,
          email,
          purpose,
          company,
          context,
        }),
      });
    } catch {
      // still tell the visitor it's handled; the server logs it either way
    }
  }

  function startContactFlow() {
    setStage("ask_purpose");
    addBot(
      "Say no more, I'll let her know! 🙌 What's the purpose of reaching out? Pick one below."
    );
  }

  function choosePurpose(label) {
    setPurpose(label);
    setStage("ask_company");
    setMessages((m) => [
      ...m,
      { role: "user", content: label },
      { role: "assistant", content: "Great! Which company are you from?" },
    ]);
  }

  function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    send(text);
  }

  async function send(text) {

    // ----- contact flow stages -----
    if (stage === "ask_purpose") {
      choosePurpose(guessPurpose(text));
      return;
    }
    if (stage === "ask_company") {
      setCompany(text);
      setStage("ask_name");
      setMessages((m) => [
        ...m,
        { role: "user", content: text },
        { role: "assistant", content: "Got it! And what's your name?" },
      ]);
      return;
    }
    if (stage === "ask_name") {
      setLeadName(text);
      setStage("ask_email");
      setMessages((m) => [
        ...m,
        { role: "user", content: text },
        {
          role: "assistant",
          content: `Nice to meet you, ${text}! What's the best email for her to reach you at?`,
        },
      ]);
      return;
    }
    if (stage === "ask_email") {
      setMessages((m) => [...m, { role: "user", content: text }]);
      if (!EMAIL_RE.test(text)) {
        addBot("Hmm, that email doesn't look right. Could you type it again?");
        return;
      }
      setStage("chat");
      addBot("Perfect, sending that over now... 📬");
      await sendLead(leadName, text);
      addBot(
        "Done! Your message has been sent, and Shravani will contact you within 24 hours. Anything else you want to know?"
      );
      return;
    }

    // ----- normal chat -----
    const userMsg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    if (wantsContact(text)) {
      startContactFlow();
      return;
    }

    setBusy(true);
    try {
      const reply = await callChat(
        nextMessages.map((m) => ({ role: m.role, content: m.content }))
      );
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      if (BYE_RE.test(text)) {
        onFarewellTriggered && onFarewellTriggered();
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Hmm, I glitched for a sec — mind asking that again?" },
      ]);
    } finally {
      setBusy(false);
    }
  }

  // Messages sent from outside (e.g. the "Say hi" button) arrive as `incoming`.
  // The ref always points at the latest send(), so it never uses stale state.
  const sendRef = useRef(send);
  sendRef.current = send;
  const lastIncoming = useRef(null);
  useEffect(() => {
    if (!incoming || incoming.id === lastIncoming.current) return;
    lastIncoming.current = incoming.id;
    if (busy || stage !== "chat") return;
    sendRef.current(incoming.text);
  }, [incoming]);

  return (
    <div className="chat-panel">
      <div className="chat-thread" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`row ${m.role === "user" ? "user" : "bot"}`}>
            <div className="bubble">{m.content}</div>
          </div>
        ))}
        {stage === "ask_purpose" && (
          <div className="row bot">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PURPOSES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => choosePurpose(p)}
                  style={{
                    background: "#ccff5c",
                    color: "#0b0d17",
                    border: "2px solid #0b0d17",
                    borderRadius: 999,
                    padding: "8px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {busy && (
          <div className="row bot">
            <div className="bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>
      <form className="chat-form" onSubmit={handleSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            stage === "ask_company"
              ? "Company name..."
              : stage === "ask_name"
              ? "Your name..."
              : stage === "ask_email"
              ? "Your email..."
              : "Ask away..."
          }
          autoComplete="off"
        />
        <button type="submit" disabled={busy}>Send</button>
      </form>
    </div>
  );
}