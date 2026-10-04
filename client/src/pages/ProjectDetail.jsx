import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { findProject } from "../data/projects.js";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = project ? `${project.title} · Shravani R S` : "Project not found";
    return () => { document.title = "Shravani R S"; };
  }, [project]);

  if (!project || !project.detail) {
    return (
      <main className="section detail">
        <h2>Project not found</h2>
        <p className="prose">That project page doesn't exist.</p>
        <Link to="/#projects" className="btn btn-ghost">Back to projects</Link>
      </main>
    );
  }

  const { detail } = project;

  return (
    <main className="section detail">
      <Link to="/#projects" className="detail-back">← All projects</Link>

      <h1 className="detail-title">{project.title}</h1>
      <p className="muted">{project.subtitle}</p>
      <p className="muted">{[project.status, project.period].filter(Boolean).join(" · ")}</p>

      <div className="chip-row detail-chips">
        {project.tech.map((t) => <span key={t} className="chip chip-sm">{t}</span>)}
      </div>

      <h2 className="detail-h">The problem</h2>
      <p className="prose">{detail.problem}</p>

      <h2 className="detail-h">How it works</h2>
      <ul className="detail-list">
        {detail.approach.map((a, i) => <li key={i} className="prose">{a}</li>)}
      </ul>

      <h2 className="detail-h">Results</h2>
      <dl className="detail-results">
        {detail.results.map((r) => (
          <div key={r.label} className="detail-result">
            <dd>{r.value}</dd>
            <dt className="muted">{r.label}</dt>
          </div>
        ))}
      </dl>

      {detail.notes?.length > 0 && (
        <>
          <h2 className="detail-h">Notes</h2>
          <ul className="detail-list">
            {detail.notes.map((n, i) => <li key={i} className="prose">{n}</li>)}
          </ul>
        </>
      )}

      {project.link && (
        <p>
          <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-primary">
            View code
          </a>
        </p>
      )}
    </main>
  );
}
