-- Indexes for the hot lookup paths. These columns are all plaintext (in the
-- platform encryption skip-list: *_id and `status`), so they index usefully.
-- Negligible at family size; avoids full table scans at org / HOA scale.
CREATE INDEX IF NOT EXISTS idx_agenda_meetings_group
  ON app_agenda__meetings (group_id);
CREATE INDEX IF NOT EXISTS idx_agenda_items_meeting
  ON app_agenda__agenda_items (meeting_id);
CREATE INDEX IF NOT EXISTS idx_agenda_actions_meeting
  ON app_agenda__action_items (meeting_id);
CREATE INDEX IF NOT EXISTS idx_agenda_actions_status
  ON app_agenda__action_items (status);
