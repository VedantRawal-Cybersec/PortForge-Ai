// Lightweight localStorage portfolio store
export interface PortfolioEntry {
  id: string;
  type: "skill" | "project" | "interview";
  title: string;
  skill: string;
  level: "Beginner" | "Intermediate" | "Strong";
  scores: { logic: number; clarity: number; depth: number; confidence?: number; quality?: number; structure?: number; creativity?: number };
  verdict: string;
  hash: string;
  createdAt: number;
}

const KEY = "aero_portfolio_v1";

export function getPortfolio(): PortfolioEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function addToPortfolio(entry: Omit<PortfolioEntry, "id" | "hash" | "createdAt">): PortfolioEntry {
  const full: PortfolioEntry = {
    ...entry,
    id: crypto.randomUUID(),
    hash: makeHash(),
    createdAt: Date.now(),
  };
  const list = getPortfolio();
  list.unshift(full);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  window.dispatchEvent(new Event("portfolio:update"));
  return full;
}

export function clearPortfolio() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("portfolio:update"));
}

function makeHash() {
  return Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function getDecayIcon(createdAt: number): string {
  const days = (Date.now() - createdAt) / 86400000;
  if (days < 7) return "🔥";
  if (days < 30) return "🧊";
  if (days < 90) return "❄️";
  return "💀";
}
