import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { findProject } from "../data/projects.js";

function Section({ title, items, note }) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <h2 className="detail-h script">{title}</h2>
      {note && <p className="muted">{note}</p>}
      <ul className="detail-list">
        {items.map((a, i) => <li key={i} className="prose">{a}</li>)}
      </ul>
    </>
  );
}

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

      <h2 className="detail-h script">The problem</h2>
      <p className="prose">{detail.problem}</p>

      <Section title="How it was built" items={detail.build} />
      <Section title="Key design choices" items={detail.approach} />

      <h2 className="detail-h script">Results</h2>
      <dl className="detail-results">
        {detail.results.map((r) => (
          <div key={r.label} className="detail-result">
            <dd>{r.value}</dd>
            <dt className="muted">{r.label}</dt>
          </div>
        ))}
      </dl>

      <Section title="Accuracy and how to verify it" items={detail.verify} />
      <Section
        title="Future development"
        items={detail.future}
        note="Plans for taking this project to the next level. These are not features that exist today."
      />
      <Section
        title="How it could serve government and public institutions"
        items={detail.government}
        note="If the project succeeds and is properly validated. These are possibilities, not current deployments."
      />
      <Section title="Notes" items={detail.notes} />

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