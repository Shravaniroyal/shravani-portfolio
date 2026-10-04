import React, { useEffect, useRef, useState } from "react";

const CONTACT_EMAIL = "rsshravani04@gmail.com";

const CONTACT_RE =
  /\b(talk to (your )?(owner|creator|her)|contact (you|her)|reach (you|her)|get (her |you )?in touch|in touch with (her|you)|(how|can|could) (do |can |could |to )?(i|we) (contact|reach|message|email|meet|talk to)|connect with (you|her)|hire (her|you)|speak (to|with) (her|you)|email her|her email|her contact)\b/i;
const BYE_RE =
  /\b(bye|goodbye|see you|see ya|gotta go|have to go|that'?s all|that is all|thanks a lot|thank you so much|thanks,? bye|ok thanks|okay thanks|thank you)\b/i;
// "why should we hire her?" is a question to answer, not a request to contact her
const WHY_RE = /\b(why|should|reasons?|worth|good fit|what makes)\b/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CANCEL_RE = /^(skip|cancel|no|nope|nah|never ?mind|stop|not now)\.?$/i;

function wantsContact(text) {
  return CONTACT_RE.test(text) && !WHY_RE.test(text);
}

function makeSessionId() {
  return "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ChatPanel({ onFarewellTriggered, onGreetShown }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Shravani's AI twin \u{1F44B} Ask me anything about her \u2014 or even who built me \u{1F440}",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("chat"); // chat | ask_name | ask_email
  const [leadName, setLeadName] = useState("");
  const sessionId = useRef(makeSessionId());
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function botSay(content) {
    setMessages((m) => [...m, { role: "assistant", content }]);
  }

  async function callChat(history) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ history, sessionId: sessionId.current }),
    });
    if (!res.ok) throw new Error("chat failed");
    const data = await res.json();
    return data.reply;
  }

  async function sendLead(name, email) {
    const context = messages
      .slice(-8)
      .map((m) => (m.role === "user" ? "Visitor: " : "Bot: ") + m.content)
      .join("\n");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, name, email, context }),
      });
    } catch {
      // still tell the visitor it's handled; the server logs it either way
    }
  }

  function cancelLead() {
    setStage("chat");
    setLeadName("");
    botSay(
      `No problem! You can also email her directly at ${CONTACT_EMAIL}. Anything else you want to know?`
    );
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const userMsg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    if (stage === "ask_name") {
      if (CANCEL_RE.test(text)) return cancelLead();
      setLeadName(text);
      setStage("ask_email");
      botSay(`Nice to meet you, ${text}! What's the best email for her to reach you at?`);
      return;
    }

    if (stage === "ask_email") {
      if (CANCEL_RE.test(text)) return cancelLead();
      if (!EMAIL_RE.test(text)) {
        botSay('That doesn\'t look like an email address. Try something like name@example.com, or say "skip" to cancel.');
        return;
      }
      setStage("chat");
      botSay("Perfect, sending that over now... \u{1F4EC}");
      await sendLead(leadName, text);
      botSay("Done! She'll reach out to you soon. Anything else you want to know?");
      return;
    }

    setBusy(true);
    try {
      const reply = await callChat(nextMessages.map((m) => ({ role: m.role, content: m.content })));
      botSay(reply);

      if (wantsContact(text)) {
        setStage("ask_name");
        setTimeout(() => {
          botSay(
            `You can email her directly at ${CONTACT_EMAIL}, or I can pass your details along. What's your name? (Say "skip" to cancel.)`
          );
        }, 400);
      } else if (BYE_RE.test(text)) {
        onFarewellTriggered && onFarewellTriggered();
      }
    } catch {
      botSay("Hmm, I glitched for a sec \u2014 mind asking that again?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat-panel">
      <div className="chat-thread" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`row ${m.role === "user" ? "user" : "bot"}`}>
            <div className="bubble">{m.content}</div>
          </div>
        ))}
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
          placeholder="Ask away..."
          autoComplete="off"
        />
        <button type="submit" disabled={busy}>Send</button>
      </form>
    </div>
  );
}