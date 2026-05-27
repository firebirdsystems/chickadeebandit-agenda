import { AVATAR_COLORS, memberColor, initial, esc, isAdult, formatRelativeDate } from "./shared.js";
export { AVATAR_COLORS, memberColor, initial, esc, isAdult, formatRelativeDate };

// ── Meetings ──────────────────────────────────────────────────────────────────

const STATUS_ORDER = { "in-progress": 0, upcoming: 1, completed: 2 };

export function sortMeetings(meetings) {
  return [...meetings].sort((a, b) => {
    const so = (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99);
    if (so !== 0) return so;
    if (a.scheduled_at && b.scheduled_at) return new Date(a.scheduled_at) - new Date(b.scheduled_at);
    if (a.scheduled_at) return -1;
    if (b.scheduled_at) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

export function upcomingMeetings(meetings) {
  return sortMeetings(meetings.filter((m) => m.status !== "completed"));
}

export function pastMeetings(meetings) {
  return [...meetings.filter((m) => m.status === "completed")]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function meetingTitle(meeting, group) {
  return meeting.title?.trim() || group?.name || "Meeting";
}

// ── Agenda items ──────────────────────────────────────────────────────────────

export function sortAgendaItems(items) {
  return [...items].sort((a, b) => a.sort_order - b.sort_order);
}

export function pendingItems(items) {
  return sortAgendaItems(items.filter((i) => i.status === "pending"));
}

export function discussedItems(items) {
  return sortAgendaItems(items.filter((i) => i.status !== "pending"));
}

// ── Action items ──────────────────────────────────────────────────────────────

export function countOpenActionItems(items) {
  return items.filter((i) => i.status === "open").length;
}

export function openActionItems(items) {
  return [...items.filter((i) => i.status === "open")]
    .sort((a, b) => {
      if (a.due_date && b.due_date) return new Date(a.due_date) - new Date(b.due_date);
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      return new Date(a.created_at) - new Date(b.created_at);
    });
}

export function filterActionItemsByAssignee(items, memberId) {
  if (!memberId) return items;
  return items.filter((i) => i.assigned_to === memberId);
}

// ── Recurrence ────────────────────────────────────────────────────────────────

export function suggestNextDate(recurrence, lastScheduledAt) {
  if (!recurrence || recurrence === "custom") return null;
  const base = lastScheduledAt ? new Date(lastScheduledAt) : new Date();
  const d = new Date(base);
  if (recurrence === "weekly")  d.setDate(d.getDate() + 7);
  if (recurrence === "monthly") d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
}

// ── Formatting ────────────────────────────────────────────────────────────────

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const opts = { month: "short", day: "numeric" };
  if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return isToday ? `Today at ${time}` : `${d.toLocaleDateString("en-US", opts)} at ${time}`;
}

export function formatDateShort(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const opts = { month: "short", day: "numeric" };
  if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString("en-US", opts);
}

export function formatDueDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date();
  const diff = d - now;
  const days = Math.ceil(diff / 86_400_000);
  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return { label, overdue: days < 0, soon: days >= 0 && days <= 2 };
}

// ── Avatar ────────────────────────────────────────────────────────────────────

export function avatarHtml(member) {
  if (!member) return `<div class="avatar" style="background:#9ca3af">${esc("?")}</div>`;
  return `<div class="avatar" style="background:${memberColor(member.id)}">${esc(initial(member.name))}</div>`;
}
