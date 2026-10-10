import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../data/projects.js";
import SCENES from "../data/heroScenes.js";

const SKILLS = {
  Languages: ["Python", "Java", "C", "SQL"],
  "AI / ML": ["Machine Learning", "Deep Learning", "CNNs", "Vision Transformers", "Transfer Learning", "Ensemble Models"],
  "Computer Vision": ["OpenCV", "Medical Imaging (MRI)", "Explainable AI (Grad-CAM)"],
  "Frameworks & Tools": ["PyTorch", "MONAI", "CrewAI", "FastAPI", "Flask", "Streamlit"],
  "Data & Cloud": ["EDA", "Statistical Analysis", "MySQL", "AWS (basics)"],
  "LLM & Agents": ["Google Gemini", "LangChain", "Groq", "Multi-Agent Systems"],
};

// one hero scene per project, plus the floating labels that belong to it
const TABS = ["TruthLens", "BrainGuard", "Stock Agents", "Watermarking", "Space Traffic"];
const LABELS = [
  ["</>", "98.18%", "Grad-CAM"],
  ["MRI", "<60 sec", "7 models"],
  ["NSE · NYSE", "30-day view", "CrewAI"],
  ["DWT+SVD", "PSNR", "BER"],
  ["LEO", "89.3%", "Decision Tree"],
];

const ICONS = {
  "truthlens": '<svg class="ic" viewBox="0 0 64 64" fill="none"><rect x="10" y="10" width="34" height="44" rx="4"/><path d="M18 22h18M18 30h18M18 38h10"/><circle cx="44" cy="40" r="10" fill="var(--lime)"/><path d="M52 48l6 6"/></svg>',
  "brainguard-ai": '<svg class="ic" viewBox="0 0 64 64" fill="none"><path d="M32 10c-8-4-18 2-17 11-6 3-6 13 0 16 0 8 8 13 17 11 9 2 17-3 17-11 6-3 6-13 0-16 1-9-9-15-17-11z"/><path d="M32 12v40"/><circle cx="22" cy="30" r="4" fill="var(--hot)"/></svg>',
  "ai-stock-intelligence": '<svg class="ic" viewBox="0 0 64 64" fill="none"><path d="M10 50V30M24 50V18M38 50V34M52 50V10"/><path d="M8 54h50"/><circle cx="52" cy="10" r="5" fill="var(--lime)"/></svg>',
  "biometric-watermarking": '<svg class="ic" viewBox="0 0 64 64" fill="none"><rect x="10" y="10" width="44" height="44" rx="5" fill="var(--lime)"/><path d="M25 10v44M39 10v44M10 25h44M10 39h44"/></svg>',
  "space-traffic-density": '<svg class="ic" viewBox="0 0 64 64" fill="none"><rect x="26" y="24" width="12" height="16" rx="2" fill="var(--lime)"/><path d="M26 28H12v8h14M38 28h14v8H38"/><ellipse cx="32" cy="32" rx="28" ry="12" transform="rotate(-25 32 32)"/></svg>',
};
const ROT = ["-1deg", "1deg", "-.6deg", "1.1deg", "-1.2deg"];
const MARQUEE = ["Python", "PyTorch", "EfficientNet", "OpenCV", "MONAI", "Grad-CAM", "SQL", "FastAPI", "Flask", "Streamlit", "CrewAI", "Gemini", "Explainable AI"];

function count(el) {
  const to = +el.dataset.to, dec = +(el.dataset.dec || 0), suf = el.dataset.suf || "", t0 = performance.now();
  (function f(t) {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = (to * p).toFixed(dec) + suf;
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}

export default function Home({ onOpenChat, onSayHi }) {
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);

  // show the active hero scene
  useEffect(() => {
    document.querySelectorAll(".stage .sc").forEach((s, k) => s.classList.toggle("on", k === scene));
  }, [scene]);

  // auto-rotate scenes every 5s (pauses while hovering)
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setScene((s) => (s + 1) % TABS.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  // scroll reveal + number counters
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          e.target.querySelectorAll("[data-to]").forEach(count);
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".rv").forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const L = LABELS[scene];

  return (
    <>
      <section className="hero" id="top">
        <div>
          <div className="script hot hello">Hello there!</div>
          <h1 className="script hero-name">I'm Shravani,<br /><span className="hot">nice to meet you</span></h1>
          <svg className="under" viewBox="0 0 360 22" preserveAspectRatio="none"><path d="M4 14 C60 2 120 20 180 10 S300 4 356 12" /></svg>
          <p className="hero-sub">
            AI &amp; Machine Learning engineer building interpretable AI systems for healthcare and document intelligence,
            from medical imaging to fraud detection, end to end.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">See my work</a>
            <button type="button" className="btn btn-ghost" onClick={onSayHi}>Say hi</button>
          </div>
        </div>
        <div className="art" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="stage" dangerouslySetInnerHTML={{ __html: SCENES }} />
          <span className="dood" style={{ top: "4%", left: "-2%" }}>{L[0]}</span>
          <span className="dood d2" style={{ top: "14%", right: "-4%", fontSize: "2.4rem" }}>✦</span>
          <span className="dood d3" style={{ bottom: "22%", left: "-6%" }}>{L[1]}</span>
          <span className="dood d2" style={{ bottom: "12%", right: "-2%" }}>{L[2]}</span>
          <div className="tabs">
            {TABS.map((t, i) => (
              <button key={t} className={i === scene ? "on" : ""} onClick={() => setScene(i)}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="stats">
        <div className="stat rv" style={{ "--r": "-1.5deg" }}><b className="script" data-to="1">0</b>published paper</div>
        <div className="stat rv" style={{ "--r": "1.2deg" }}><b className="script" data-to="98.18" data-dec="2" data-suf="%">0</b>TruthLens prototype test accuracy</div>
        <div className="stat rv" style={{ "--r": "-.8deg" }}><b className="script" data-to={PROJECTS.length}>0</b>projects built</div>
      </div>

      <div className="marq"><div>{[...MARQUEE, ...MARQUEE].map((s, i) => <span key={i}>{s}</span>)}</div></div>

      <section className="section" id="about">
        <h2 className="script rv">About <span className="hot">me</span></h2>
        <p className="prose rv">
          Currently pursuing an M.Tech in Data Science &amp; Artificial Intelligence at IIIT Dharwad,
          alongside hands-on experience across computer vision, medical imaging, and production AI systems.
          Comfortable across the full ML lifecycle: data engineering, model training, explainability,
          backend APIs, and deployment.
        </p>
      </section>

      <section className="section" id="education">
        <h2 className="script rv">Education</h2>
        <div className="timeline rv">
          <div className="timeline-item"><span className="timeline-dot" /><div><h3>M.Tech, Data Science &amp; Artificial Intelligence</h3><p className="muted">IIIT Dharwad · 2025 – 2027</p></div></div>
          <div className="timeline-item"><span className="timeline-dot" /><div><h3>B.E. (Honors), Artificial Intelligence and Machine Learning</h3><p className="muted">Rajarajeswari College of Engineering, Bengaluru · Nov 2021 – Jul 2025 · CGPA 8.3/10</p></div></div>
        </div>
      </section>

      <section className="section" id="skills">
        <h2 className="script rv">Skills</h2>
        <div className="skills-grid">
          {Object.entries(SKILLS).map(([group, items]) => (
            <div key={group} className="skill-group rv">
              <h4>{group}</h4>
              <div className="chip-row">{items.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="projects">
        <h2 className="script rv">Where my <span className="hot">code has been</span></h2>
        <div className="project-grid">
          {PROJECTS.map((p, i) => (
            <div key={p.title} className="card project-card rv" style={{ "--r": ROT[i % ROT.length] }}>
              <span dangerouslySetInnerHTML={{ __html: ICONS[p.slug] || "" }} />
              {p.status && <span className="tag">{p.status}</span>}
              <h3>{p.title}</h3>
              <p className="muted">{p.subtitle}</p>
              <p className="card-desc">{p.desc}</p>
              <div className="chip-row">{p.tech.map((t) => <span key={t} className="chip chip-sm">{t}</span>)}</div>
              <div className="acts">
                {p.slug && <Link to={`/projects/${p.slug}`} className="act act-main">Details →</Link>}
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="act">{p.slug ? "Code →" : "View →"}</a>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="publications">
        <h2 className="script rv">Publications</h2>
        <ul className="pub-list">
          <li className="rv">
            <strong>Biometric Watermarking using Rubik's Cube Encryption and Decryption</strong>
            <p className="muted">JETIR, Volume 11, Issue 12, 2024, from her B.E. project. <Link to="/projects/biometric-watermarking">Project page →</Link></p>
          </li>
          <li className="rv">
            <strong>TruthLens: AI-Powered Multi-Modal Document Fraud Detection</strong>
            <p className="muted">Manuscript in preparation, IEEE Transactions on Information Forensics and Security, from her M.Tech project. <Link to="/projects/truthlens">Project page →</Link></p>
          </li>
        </ul>
      </section>

      <section className="section" id="experience">
        <h2 className="script rv">The <span className="hot">journey</span> so far</h2>
        <div className="timeline rv">
          <div className="timeline-item"><span className="timeline-dot" /><div><h3>AI/ML Engineer Intern, Starmark Healthcare IT</h3><p className="muted">Jul 2026 – Sep 2026</p></div></div>
          <div className="timeline-item"><span className="timeline-dot" /><div><h3>Machine Learning Intern, Infosys Springboard</h3><p className="muted">Nov 2024 – Dec 2024</p></div></div>
          <div className="timeline-item"><span className="timeline-dot" /><div><h3>Data Science Intern, Rooman Technologies</h3><p className="muted">Oct 2024 – Dec 2024 · <Link to="/projects/space-traffic-density">Space Traffic Density Prediction →</Link></p></div></div>
        </div>
      </section>

      <section className="cta rv" id="contact">
        <div className="script cta-title">Let's build something <span className="hot">together!</span></div>
        <p className="prose" style={{ margin: "8px auto 18px" }}>
          Internship, job or just a hello? Reach out directly, or just chat with my AI twin on the side.
        </p>
        <p className="prose" style={{ margin: "0 auto 18px" }}>
          💬 You can also contact me through the chat: tell it "connect me with her", answer a few quick questions,
          and it emails me your details so I can contact you back within 24 hours.
        </p>
        <div className="contact-links">
          <a href="mailto:rsshravani04@gmail.com">rsshravani04@gmail.com</a>
          <a href="https://linkedin.com/in/shravani-r-s-616b49290" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/Shravaniroyal" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <p><button className="btn btn-primary" onClick={onOpenChat}>Chat with my AI twin</button></p>
      </section>

      <footer className="footer"><p>Built by Shravani R S · {new Date().getFullYear()}</p></footer>
    </>
  );
}