import React, { useMemo } from "react";

const QUOTES = [
  "Start small. Stay consistent.",
  "One focused session is a win.",
  "Don’t quit. You’re building discipline.",
  "Progress over perfection.",
  "Discipline beats motivation."
];

export default function QuoteBox({ mode }) {
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [mode]);
  return <div className="badge">{mode === "focus" ? "Focus boost: " : "Break reminder: "} {quote}</div>;
}
