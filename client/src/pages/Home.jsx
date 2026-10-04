import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PROJECTS } from "../data/projects.js";

const SKILLS = {
  Languages: ["Python", "Java", "C", "SQL"],
  "AI / ML": ["Machine Learning", "Deep Learning", "CNNs", "Vision Transformers", "Transfer Learning", "Ensemble Models"],
  "Computer Vision": ["OpenCV", "Medical Imaging (MRI)", "Explainable AI (Grad-CAM)"],
  "Frameworks & Tools": ["PyTorch", "MONAI", "CrewAI", "FastAPI", "Flask", "Streamlit"],
  "Data & Cloud": ["EDA", "Statistical Analysis", "MySQL", "AWS (basics)"],
  "LLM & Agents": ["Google Gemini", "LangChain", "Groq", "Multi-Agent Systems"],
};

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setStyle({ transform: `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)` });
  }
  function onLeave() {
    setStyle({ transform: "perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)" });
  }
  return (
    <div ref={ref} className={`tilt-card ${className}`} style={style} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">AI & Machine Learning Engineer</p>
          <h1 className="hero-name">Shravani R S</h1>
          <p className="hero-sub">
            Building interpretable AI systems for healthcare and document intelligence —
            from medical imaging to fraud detection, end to end.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">See projects</a>
            <a href="#contact" className="btn btn-ghost">Contact</a>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <h2>About</h2>
        <p className="prose">
          Currently pursuing an M.Tech in Data Science & Artificial Intelligence at IIIT Dharwad,
          alongside hands-on experience across computer vision, medical imaging, and production AI systems.
          Comfortable across the full ML lifecycle — data engineering, model training, explainability,
          backend APIs, and deployment.
        </p>
      </section>

      <section className="section" id="education">
        <h2>Education</h2>
        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-dot" />
            <div>
              <h3>M.Tech, Data Science & Artificial Intelligence</h3>
              <p className="muted">IIIT Dharwad · 2025 – 2027</p>
            </div>
          </div>
          <div className="timeline-item">
            <span className="timeline-dot" />
            <div>
              <h3>B.E. (Honors), Artificial Intelligence and Machine Learning</h3>
              <p className="muted">Rajarajeswari College of Engineering, Bengaluru · Nov 2021 – Jul 2025 · CGPA 8.3/10</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <h2>Skills</h2>
        <div className="skills-grid">
          {Object.entries(SKILLS).map(([group, items]) => (
            <div key={group} className="skill-group">
              <h4>{group}</h4>
              <div className="chip-row">
                {items.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="projects">
        <h2>Projects</h2>
        <div className="project-grid">
          {PROJECTS.map((p) => (
            <TiltCard key={p.title} className="project-card">
              <h3>{p.title}</h3>
              <p className="muted">{p.subtitle}</p>
              <p className="prose">{p.desc}</p>
              <div className="chip-row">
                {p.tech.map((t) => <span key={t} className="chip chip-sm">{t}</span>)}
              </div>
              <div className="project-links">
                {p.slug && <Link to={`/projects/${p.slug}`} className="project-link">Details →</Link>}
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="project-link">
                    {p.slug ? "Code →" : "View →"}
                  </a>
                )}
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="section" id="publications">
        <h2>Publications</h2>
        <ul className="pub-list">
          <li>
            <strong>Biometric Watermarking using Rubik's Cube Encryption and Decryption</strong>
            <p className="muted">
              JETIR, Volume 11, Issue 12, 2024 — from her B.E. project.{" "}
              <Link to="/projects/biometric-watermarking">Project page →</Link>
            </p>
          </li>
          <li>
            <strong>TruthLens: AI-Powered Multi-Modal Document Fraud Detection</strong>
            <p className="muted">
              Manuscript in preparation, IEEE Transactions on Information Forensics and Security — from her M.Tech project.{" "}
              <Link to="/projects/truthlens">Project page →</Link>
            </p>
          </li>
        </ul>
      </section>

      <section className="section" id="experience">
        <h2>Internships</h2>
        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-dot" />
            <div>
              <h3>AI/ML Engineer Intern — Starmark Healthcare IT</h3>
              <p className="muted">Jul 2026 – Sep 2026</p>
            </div>
          </div>
          <div className="timeline-item">
            <span className="timeline-dot" />
            <div>
              <h3>Machine Learning Intern — Infosys Springboard</h3>
              <p className="muted">Nov 2024 – Dec 2024</p>
            </div>
          </div>
          <div className="timeline-item">
            <span className="timeline-dot" />
            <div>
              <h3>Data Science Intern — Rooman Technologies</h3>
              <p className="muted">
                Oct 2024 – Dec 2024 ·{" "}
                <Link to="/projects/space-traffic-density">Space Traffic Density Prediction →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <h2>Contact</h2>
        <p className="prose">
          Reach out directly, or use the chat assistant in the corner — it'll pass your message along.
        </p>
        <div className="contact-links">
          <a href="mailto:rsshravani04@gmail.com">rsshravani04@gmail.com</a>
          <a href="https://linkedin.com/in/shravani-r-s-616b49290" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/Shravaniroyal" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </section>

      <footer className="footer">
        <p>Built by Shravani R S · {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}
