CREATE TABLE duel_rooms (
  id TEXT PRIMARY KEY NOT NULL,
  code TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX duel_rooms_expiry ON duel_rooms (expires_at);
