SELECT
  a.id,
  a.title,
  a.assigned_to,
  a.due_date,
  a.status,
  a.created_at,
  m.title AS meeting_title,
  m.scheduled_at AS meeting_date
FROM app_agenda__action_items a
JOIN app_agenda__meetings m
  ON m.id = a.meeting_id
WHERE a.status       = 'open'
ORDER BY a.due_date NULLS LAST, a.created_at
LIMIT 100
