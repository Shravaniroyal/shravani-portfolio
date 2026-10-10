import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import Home from "./pages/Home.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";

// Scrolls to #hash targets after route changes (e.g. "/#projects" from a detail page).
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  const firstLoad = useRef(true);

  // Don't let the browser jump back to an old scroll position on refresh
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    // On the first load or a refresh, always start at the top (the intro section),
    // even if the address still ends with #projects from an earlier click.
    if (firstLoad.current) {
      firstLoad.current = false;
      if (window.location.hash) window.history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
      return;
    }
    const current = window.location.hash; // read live, so a stripped hash stays stripped
    if (!current) {
      window.scrollTo(0, 0);
      return;
    }
    const id = current.slice(1);
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView(), 0);
    return () => clearTimeout(t);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [open, setOpen] = useState(false); // chat drawer on phones
  const [incoming, setIncoming] = useState(null); // message pushed into the chat from the page
  const sayHi = () => {
    setOpen(true);
    setIncoming({ id: Date.now(), text: "Hi! 👋" });
  };

  return (
    <div className="page">
      <div className="layout">
        <div className="content">
          <Nav />
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Home onOpenChat={() => setOpen(true)} onSayHi={sayHi} />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<Home onOpenChat={() => setOpen(true)} onSayHi={sayHi} />} />
          </Routes>
        </div>
        <aside className={`side ${open ? "open" : ""}`}>
          <div className="chat-shell">
            <header className="chat-head">
              <span><i className="dot" />Chat with Shravani's AI twin</span>
              <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
            </header>
            <div className="chat-body">
              <ChatPanel incoming={incoming} />
            </div>
          </div>
        </aside>
      </div>
      <button className="fab" onClick={() => setOpen(true)} aria-label="Open chat">💬</button>
    </div>
  );
}