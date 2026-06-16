CREATE TABLE IF NOT EXISTS app_agenda__meeting_groups (
  id           TEXT NOT NULL,
  name         TEXT NOT NULL,
  description  TEXT,
  recurrence   TEXT,
  audience     TEXT NOT NULL DEFAULT 'everyone',
  created_by   TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS app_agenda__meetings (
  id           TEXT NOT NULL,
  group_id     TEXT NOT NULL,
  title        TEXT,
  scheduled_at TEXT,
  status       TEXT NOT NULL DEFAULT 'upcoming',
  notes        TEXT,
  created_by   TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS app_agenda__agenda_items (
  id            TEXT NOT NULL,
  meeting_id    TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  submitted_by  TEXT NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS app_agenda__action_items (
  id             TEXT NOT NULL,
  meeting_id     TEXT NOT NULL,
  agenda_item_id TEXT,
  title          TEXT NOT NULL,
  assigned_to    TEXT,
  due_date       TEXT,
  status         TEXT NOT NULL DEFAULT 'open',
  created_at     TEXT NOT NULL,
  completed_at   TEXT,
  PRIMARY KEY (id)
);
