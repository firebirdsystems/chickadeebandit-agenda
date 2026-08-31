-- upcoming_meetings filters on status and orders by scheduled_at. Both are
-- plaintext (status is a hub built-in; scheduled_at by the _at suffix rule), so
-- the index is usable at rest. The ORDER BY leads with (scheduled_at IS NULL) —
-- the NULLS LAST idiom — which no index can serve, so the sort remains; what
-- this removes is the full scan of every meeting ever held.
CREATE INDEX IF NOT EXISTS idx_agenda_meetings_status_scheduled
  ON app_agenda__meetings(status, scheduled_at);
