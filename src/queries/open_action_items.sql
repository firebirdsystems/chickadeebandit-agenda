SELECT
  a.id,
  a.title,
  a.assigned_to,
  a.due_date,
  a.status,
  a.created_at,
  m.title AS meeting_title,
  m.scheduled_at AS meeting_date
FROM action_items a
JOIN meetings m
  ON m.id           = a.meeting_id
  AND m.household_id = a.household_id
WHERE a.household_id = current_setting('app.household_id', true)::uuid
  AND a.status       = 'open'
ORDER BY a.due_date NULLS LAST, a.created_at
LIMIT 100
