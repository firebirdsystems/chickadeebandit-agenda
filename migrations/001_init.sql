CREATE TABLE IF NOT EXISTS meeting_groups (
  household_id UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  id           TEXT NOT NULL,
  name         TEXT NOT NULL,
  description  TEXT,
  recurrence   TEXT,
  audience     TEXT NOT NULL DEFAULT 'everyone',
  created_by   TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  PRIMARY KEY (household_id, id)
);

CREATE TABLE IF NOT EXISTS meetings (
  household_id UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  id           TEXT NOT NULL,
  group_id     TEXT NOT NULL,
  title        TEXT,
  scheduled_at TEXT,
  status       TEXT NOT NULL DEFAULT 'upcoming',
  notes        TEXT,
  created_by   TEXT NOT NULL,
  created_at   TEXT NOT NULL,
  PRIMARY KEY (household_id, id)
);

CREATE TABLE IF NOT EXISTS agenda_items (
  household_id  UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  id            TEXT NOT NULL,
  meeting_id    TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  submitted_by  TEXT NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TEXT NOT NULL,
  PRIMARY KEY (household_id, id)
);

CREATE TABLE IF NOT EXISTS action_items (
  household_id   UUID NOT NULL DEFAULT current_setting('app.household_id', true)::uuid,
  id             TEXT NOT NULL,
  meeting_id     TEXT NOT NULL,
  agenda_item_id TEXT,
  title          TEXT NOT NULL,
  assigned_to    TEXT,
  due_date       TEXT,
  status         TEXT NOT NULL DEFAULT 'open',
  created_at     TEXT NOT NULL,
  completed_at   TEXT,
  PRIMARY KEY (household_id, id)
);
