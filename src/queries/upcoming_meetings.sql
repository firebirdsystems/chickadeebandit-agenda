SELECT
  m.id,
  m.title,
  m.scheduled_at,
  m.status,
  m.notes,
  g.name AS group_name,
  m.created_at
FROM meetings m
JOIN meeting_groups g
  ON g.id           = m.group_id
  AND g.household_id = m.household_id
WHERE m.household_id = current_setting('app.household_id', true)::uuid
  AND m.status       = 'upcoming'
  AND (m.scheduled_at IS NULL OR m.scheduled_at >= NOW()::text)
ORDER BY m.scheduled_at NULLS LAST
LIMIT 50
