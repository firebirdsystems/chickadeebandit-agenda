/**
 * Shared utilities from hub-sdk.js — re-exported here so logic.js tests
 * can import them without a browser environment.
 */

export const AVATAR_COLORS = [
  "#0284c7","#0891b2","#059669","#7c3aed","#db2777","#ea580c","#65a30d","#b45309",
];

export function memberColor(id, _members) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function initial(name) {
  const s = String(name ?? "").trim();
  return s ? s[0].toUpperCase() : "?";
}

export function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function isAdult(member) {
  return !!member && (member.role === "adult" || member.role === "admin");
}

export function formatRelativeDate(iso) {
  const now = new Date(), d = new Date(iso), diff = now - d;
  const mins = Math.floor(diff / 60_000), hours = Math.floor(diff / 3_600_000), days = Math.floor(diff / 86_400_000);
  if (mins  <  1) return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days  <  7) return d.toLocaleDateString("en-US", { weekday: "short" });
  if (now.getFullYear() === d.getFullYear())
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
