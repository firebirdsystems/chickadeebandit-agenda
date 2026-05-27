import { describe, it, expect } from "vitest";
import {
  isAdult, esc, initial, memberColor, AVATAR_COLORS, formatRelativeDate,
  sortMeetings, upcomingMeetings, pastMeetings, meetingTitle,
  sortAgendaItems, pendingItems, discussedItems,
  countOpenActionItems, openActionItems, filterActionItemsByAssignee,
  suggestNextDate, formatDate, formatDateShort, formatDueDate,
} from "../src/logic.js";

// ── isAdult ───────────────────────────────────────────────────────────────────
describe("isAdult", () => {
  it("returns true for adult role",  () => expect(isAdult({ role: "adult" })).toBe(true));
  it("returns true for admin role",  () => expect(isAdult({ role: "admin" })).toBe(true));
  it("returns false for child role", () => expect(isAdult({ role: "child" })).toBe(false));
  it("returns false for null",       () => expect(isAdult(null)).toBe(false));
});

// ── esc ───────────────────────────────────────────────────────────────────────
describe("esc", () => {
  it("escapes HTML characters", () => {
    expect(esc('<script>&"')).toBe("&lt;script&gt;&amp;&quot;");
  });
  it("passes plain text unchanged", () => {
    expect(esc("hello")).toBe("hello");
  });
});

// ── initial / memberColor ─────────────────────────────────────────────────────
describe("initial", () => {
  it("uppercases first letter", () => expect(initial("alice")).toBe("A"));
  it("returns ? for empty",     () => expect(initial("")).toBe("?"));
});

describe("memberColor", () => {
  it("returns a color from AVATAR_COLORS", () => expect(AVATAR_COLORS).toContain(memberColor("x")));
  it("is stable for same id", () => expect(memberColor("abc")).toBe(memberColor("abc")));
});

// ── sortMeetings ──────────────────────────────────────────────────────────────
describe("sortMeetings", () => {
  const base = { created_at: "2024-01-01T00:00:00Z" };
  const meetings = [
    { id: "1", status: "completed",   scheduled_at: "2024-01-10T10:00:00Z", ...base },
    { id: "2", status: "upcoming",    scheduled_at: "2024-01-15T10:00:00Z", ...base },
    { id: "3", status: "in-progress", scheduled_at: "2024-01-12T10:00:00Z", ...base },
  ];

  it("puts in-progress first, then upcoming, then completed", () => {
    const sorted = sortMeetings(meetings);
    expect(sorted[0].status).toBe("in-progress");
    expect(sorted[1].status).toBe("upcoming");
    expect(sorted[2].status).toBe("completed");
  });

  it("does not mutate original array", () => {
    const original = [...meetings];
    sortMeetings(meetings);
    expect(meetings.map(m => m.id)).toEqual(original.map(m => m.id));
  });
});

// ── upcomingMeetings / pastMeetings ───────────────────────────────────────────
describe("upcomingMeetings", () => {
  const meetings = [
    { id: "1", status: "completed",   created_at: "2024-01-01T00:00:00Z" },
    { id: "2", status: "upcoming",    created_at: "2024-01-01T00:00:00Z" },
    { id: "3", status: "in-progress", created_at: "2024-01-01T00:00:00Z" },
  ];
  it("excludes completed meetings", () => {
    const result = upcomingMeetings(meetings);
    expect(result.every(m => m.status !== "completed")).toBe(true);
    expect(result.length).toBe(2);
  });
});

describe("pastMeetings", () => {
  const meetings = [
    { id: "1", status: "completed", created_at: "2024-01-01T00:00:00Z" },
    { id: "2", status: "upcoming",  created_at: "2024-01-01T00:00:00Z" },
  ];
  it("includes only completed meetings", () => {
    expect(pastMeetings(meetings).every(m => m.status === "completed")).toBe(true);
    expect(pastMeetings(meetings).length).toBe(1);
  });
});

// ── meetingTitle ──────────────────────────────────────────────────────────────
describe("meetingTitle", () => {
  it("uses meeting title when present",       () => expect(meetingTitle({ title: "Q1 Review" }, { name: "Board" })).toBe("Q1 Review"));
  it("falls back to group name when no title",() => expect(meetingTitle({ title: null }, { name: "Board" })).toBe("Board"));
  it("falls back to Meeting when no group",   () => expect(meetingTitle({ title: "" }, null)).toBe("Meeting"));
});

// ── sortAgendaItems ───────────────────────────────────────────────────────────
describe("sortAgendaItems", () => {
  const items = [
    { id: "a", sort_order: 2 },
    { id: "b", sort_order: 0 },
    { id: "c", sort_order: 1 },
  ];
  it("sorts by sort_order ascending", () => {
    const sorted = sortAgendaItems(items);
    expect(sorted.map(i => i.id)).toEqual(["b","c","a"]);
  });
});

// ── pendingItems / discussedItems ─────────────────────────────────────────────
describe("pendingItems", () => {
  const items = [
    { id: "1", status: "pending",   sort_order: 0 },
    { id: "2", status: "discussed", sort_order: 1 },
    { id: "3", status: "tabled",    sort_order: 2 },
  ];
  it("returns only pending items", () => {
    expect(pendingItems(items).every(i => i.status === "pending")).toBe(true);
    expect(pendingItems(items).length).toBe(1);
  });
});

describe("discussedItems", () => {
  const items = [
    { id: "1", status: "pending",   sort_order: 0 },
    { id: "2", status: "discussed", sort_order: 1 },
    { id: "3", status: "tabled",    sort_order: 2 },
  ];
  it("returns non-pending items", () => {
    const result = discussedItems(items);
    expect(result.every(i => i.status !== "pending")).toBe(true);
    expect(result.length).toBe(2);
  });
});

// ── countOpenActionItems ──────────────────────────────────────────────────────
describe("countOpenActionItems", () => {
  const items = [
    { status: "open" }, { status: "open" }, { status: "done" },
  ];
  it("counts only open items", () => expect(countOpenActionItems(items)).toBe(2));
  it("returns 0 for empty array", () => expect(countOpenActionItems([])).toBe(0));
});

// ── openActionItems ───────────────────────────────────────────────────────────
describe("openActionItems", () => {
  const items = [
    { id: "1", status: "open", due_date: "2025-12-31", created_at: "2024-01-01T00:00:00Z" },
    { id: "2", status: "done", due_date: null,         created_at: "2024-01-01T00:00:00Z" },
    { id: "3", status: "open", due_date: "2025-06-01", created_at: "2024-01-01T00:00:00Z" },
  ];
  it("returns only open items", () => expect(openActionItems(items).every(i => i.status === "open")).toBe(true));
  it("sorts by due date ascending", () => {
    const result = openActionItems(items);
    expect(result[0].id).toBe("3");
    expect(result[1].id).toBe("1");
  });
});

// ── filterActionItemsByAssignee ───────────────────────────────────────────────
describe("filterActionItemsByAssignee", () => {
  const items = [
    { id: "1", assigned_to: "m1" },
    { id: "2", assigned_to: "m2" },
    { id: "3", assigned_to: null },
  ];
  it("filters by member id", () => {
    expect(filterActionItemsByAssignee(items, "m1").length).toBe(1);
  });
  it("returns all items when no filter", () => {
    expect(filterActionItemsByAssignee(items, "").length).toBe(3);
  });
  it("returns all items when null filter", () => {
    expect(filterActionItemsByAssignee(items, null).length).toBe(3);
  });
});

// ── suggestNextDate ───────────────────────────────────────────────────────────
describe("suggestNextDate", () => {
  it("returns null for no recurrence", () => expect(suggestNextDate(null, null)).toBeNull());
  it("returns null for custom recurrence", () => expect(suggestNextDate("custom", null)).toBeNull());
  it("adds 7 days for weekly", () => {
    const base = "2024-03-01T10:00:00Z";
    const result = suggestNextDate("weekly", base);
    expect(result).toBeTruthy();
    expect(new Date(result).getDate()).toBe(8);
  });
  it("adds 1 month for monthly", () => {
    const base = "2024-03-15T10:00:00Z";
    const result = suggestNextDate("monthly", base);
    expect(new Date(result).getMonth()).toBe(3); // April
  });
});

// ── formatDueDate ─────────────────────────────────────────────────────────────
describe("formatDueDate", () => {
  it("returns null for no date", () => expect(formatDueDate(null)).toBeNull());
  it("returns an object with label, overdue, soon fields for a valid date", () => {
    const result = formatDueDate("2099-12-31");
    expect(result).toHaveProperty("label");
    expect(result).toHaveProperty("overdue");
    expect(result).toHaveProperty("soon");
    expect(result.overdue).toBe(false);
  });
  it("marks past dates as overdue", () => {
    const result = formatDueDate("2020-01-01");
    expect(result.overdue).toBe(true);
  });
});
