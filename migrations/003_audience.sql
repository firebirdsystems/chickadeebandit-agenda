-- Enforce meeting-series audience (everyone / adults) server-side for meeting
-- content. The audience was previously decorative — an adults-only series was
-- readable by everyone. We denormalize a plaintext `audience` onto meetings,
-- agenda_items, and action_items so each can carry an owner_or_visibility row
-- policy keyed on it. (meeting_groups.audience is encrypted at rest and only holds
-- series metadata, so it is left unpoliced; the protected content is the meetings,
-- items, and notes.)
--
-- Existing rows default to 'everyone' (their current effective visibility — no
-- regression). New content created after this migration carries the series'
-- audience (set client-side, where it is available decrypted) and is enforced.
ALTER TABLE app_agenda__meetings ADD COLUMN audience TEXT NOT NULL DEFAULT 'everyone';
ALTER TABLE app_agenda__agenda_items ADD COLUMN audience TEXT NOT NULL DEFAULT 'everyone';
ALTER TABLE app_agenda__action_items ADD COLUMN audience TEXT NOT NULL DEFAULT 'everyone';
ALTER TABLE app_agenda__action_items ADD COLUMN created_by TEXT NOT NULL DEFAULT '';
