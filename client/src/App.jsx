import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import Home from "./pages/Home.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";

// Scrolls to #hash targets after route changes (e.g. "/#projects" from a detail page).
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.slice(1);
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView(), 0);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [open, setOpen] = useState(false); // chat drawer on phones

  return (
    <div className="page">
      <div className="layout">
        <div className="content">
          <Nav />
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Home onOpenChat={() => setOpen(true)} />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<Home onOpenChat={() => setOpen(true)} />} />
          </Routes>
        </div>
        <aside className={`side ${open ? "open" : ""}`}>
          <div className="chat-shell">
            <header className="chat-head">
              <span><i className="dot" />Chat with Shravani's AI twin</span>
              <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
            </header>
            <div className="chat-body">
              <ChatPanel />
            </div>
          </div>
        </aside>
      </div>
      <button className="fab" onClick={() => setOpen(true)} aria-label="Open chat">💬</button>
    </div>
  );
}