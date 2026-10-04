import React from "react";
import { Link } from "react-router-dom";

const LINKS = [
  ["About", "/#about"],
  ["Skills", "/#skills"],
  ["Projects", "/#projects"],
  ["Publications", "/#publications"],
  ["Experience", "/#experience"],
  ["Contact", "/#contact"],
];

export default function Nav() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">Shravani R S</Link>
      <div className="nav-links">
        {LINKS.map(([label, to]) => (
          <Link key={to} to={to}>{label}</Link>
        ))}
      </div>
    </nav>
  );
}