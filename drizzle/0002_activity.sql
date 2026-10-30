-- Additive. Creates the activity table for T-37k (BR-86) only.
-- Does not change any other table. npm run db:push creates the same table from lib/db/schema.ts.
SET client_min_messages TO warning;
CREATE TABLE IF NOT EXISTS activity (
  id serial PRIMARY KEY,
  at timestamp with time zone NOT NULL DEFAULT now(),
  user_id integer NOT NULL,
  user_email text NOT NULL,
  area text NOT NULL,
  kind text NOT NULL,
  record_id text NOT NULL DEFAULT '',
  text text NOT NULL
);
CREATE INDEX IF NOT EXISTS activity_at_idx ON activity (at);
CREATE INDEX IF NOT EXISTS activity_kind_record_at_idx ON activity (kind, record_id, at);
