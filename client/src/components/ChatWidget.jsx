import React, { useState } from "react";
import ChatPanel from "./ChatPanel.jsx";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-widget-panel">
          <div className="chat-widget-head">
            <span>Chat with Shravani's AI twin</span>
            <button aria-label="Close chat" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chat-widget-body">
            <ChatPanel />
          </div>
        </div>
      )}
      <button
        className="chat-widget-launcher"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}