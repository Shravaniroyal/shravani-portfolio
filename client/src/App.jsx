import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NeuralBG from "./components/NeuralBG.jsx";
import Nav from "./components/Nav.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
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
  return (
    <div className="page">
      <NeuralBG />
      <Nav />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <ChatWidget />
    </div>
  );
}
