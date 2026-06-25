-- Enforce meeting-series audience (everyone / adults) server-side for meeting
-- content. The audience was previously decorative — an adults-only series was
-- readable by everyone. We denormalize a plaintext `audience` onto meetings,
-- agenda_items, and action_items so each can carry an owner_or_visibility row
-- policy keyed on it. (`meeting_groups` is also policed in the manifest on its own
-- `audience` column; `audience` is in the platform encryption skip-list, so it is
-- stored plaintext and the policy compares correctly. The primary protected content
-- is the meetings, items, and notes.)
--
-- NOTE: rows written before `audience` joined the skip-list have it encrypted at
-- rest, so an adults-only series created earlier cannot be backfilled from SQL (no
-- decrypt) — only content created after this migration is enforced.
--
-- Existing rows default to 'everyone' (their current effective visibility — no
-- regression). New content created after this migration carries the series'
-- audience (set client-side, where it is available decrypted) and is enforced.
ALTER TABLE app_agenda__meetings ADD COLUMN audience TEXT NOT NULL DEFAULT 'everyone';
ALTER TABLE app_agenda__agenda_items ADD COLUMN audience TEXT NOT NULL DEFAULT 'everyone';
ALTER TABLE app_agenda__action_items ADD COLUMN audience TEXT NOT NULL DEFAULT 'everyone';
ALTER TABLE app_agenda__action_items ADD COLUMN created_by TEXT NOT NULL DEFAULT '';
