SELECT
  m.id,
  m.title,
  m.scheduled_at,
  m.status,
  m.notes,
  g.name AS group_name,
  m.created_at
FROM app_agenda__meetings m
JOIN app_agenda__meeting_groups g
  ON g.id = m.group_id
WHERE m.status       = 'upcoming'
  AND (m.scheduled_at IS NULL OR m.scheduled_at >= datetime('now'))
ORDER BY m.scheduled_at NULLS LAST
LIMIT 50
