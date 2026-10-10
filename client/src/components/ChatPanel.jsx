import React, { useEffect, useRef, useState } from "react";

const API = import.meta.env.VITE_API_URL || "";
// Words that mean "get in touch" (typo tolerant: conntact, conncet, msg ...)
const CONTACT_VERB_RE =
  /\b(con+tact|con+ec?t|conn?c+e?t|reach|messag\w*|msg|ping|meet|call|hire|hiring|talk|speak|e-?mail|mail|in touch|get back|pass (a |my |the )?(msg|message)|tell her|let her know|inform her|notify|forward)\b/i;
const CONTACT_TARGET_RE = /\b(her|she|shravani|owner|creator|you)\b/i;
const EMAIL_ASK_RE = /\b(what'?s|what is|give me|share|show)\b.*\b(her |your )?(email|mail id|email id|address)\b/i;
const BYE_RE =
  /\b(bye|goodbye|see you|see ya|gotta go|have to go|that'?s all|that is all|thanks a lot|thank you so much|thanks,? bye|ok thanks|okay thanks|thank you)\b/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINKEDIN_RE = /linkedin\.com\/|^https?:\/\/|^(in\/|@)[\w-]+/i;

// "why should we hire her?" is a question to answer, not a request to contact her
const WHY_RE = /\b(why|should|reasons?|worth|good fit|what makes)\b/i;
function wantsContact(text) {
  if (EMAIL_ASK_RE.test(text)) return false; // just asking for the address: answer normally
  return CONTACT_VERB_RE.test(text) && CONTACT_TARGET_RE.test(text) && !WHY_RE.test(text);
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

  async function sendLead(name, { email = "", linkedin = "" }) {
    const chatContext = messages
      .slice(-8)
      .map((m) => (m.role === "user" ? "Visitor: " : "Bot: ") + m.content)
      .join("\n");
    const context =
      `Purpose: ${purpose}\n${company ? `Company: ${company}\n` : ""}\nRecent chat:\n` + chatContext;
    // Returns "sent" (email delivered), "saved" (logged but email failed) or "failed".
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch(`${API}/api/lead`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          sessionId: sessionId.current,
          name,
          email,
          linkedin,
          purpose,
          company,
          context,
        }),
      });
      if (!res.ok) return "failed";
      const data = await res.json();
      return data.emailed ? "sent" : "saved";
    } catch {
      return "failed";
    } finally {
      clearTimeout(timer);
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
    setCompany("");
    // General inquiries don't need a company, so go straight to the name
    const general = label === "General inquiry";
    setStage(general ? "ask_name" : "ask_company");
    setMessages((m) => [
      ...m,
      { role: "user", content: label },
      {
        role: "assistant",
        content: general ? "Great! What's your name?" : "Great! Which company are you from?",
      },
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
          content: `Nice to meet you, ${text}! What's the best way for her to reach you: your email address or your LinkedIn profile link?`,
        },
      ]);
      return;
    }
    if (stage === "ask_email") {
      setMessages((m) => [...m, { role: "user", content: text }]);
      const isEmail = EMAIL_RE.test(text);
      const isLinkedIn = !isEmail && LINKEDIN_RE.test(text);
      if (!isEmail && !isLinkedIn) {
        addBot("Hmm, I couldn't read that. Please type your email address (like name@example.com) or paste your LinkedIn profile link.");
        return;
      }
      setStage("chat");
      addBot("Perfect, sending that over now... 📬");
      const result = await sendLead(leadName, isEmail ? { email: text } : { linkedin: text });
      if (result === "sent") {
        addBot(
          "✅ Done! Your message has been sent to Shravani, and she will contact you within 24 hours. Anything else you want to know?"
        );
      } else if (result === "saved") {
        addBot(
          "I saved your details, but the email didn't go through on my side. To be safe, please also write to her directly at rsshravani04@gmail.com. Sorry about that!"
        );
      } else {
        addBot(
          "Sorry, I couldn't send that just now. Please try again in a minute, or email her directly at rsshravani04@gmail.com."
        );
      }
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
              ? "Your email or LinkedIn link..."
              : "Ask away..."
          }
          autoComplete="off"
        />
        <button type="submit" disabled={busy}>Send</button>
      </form>
    </div>
  );
}