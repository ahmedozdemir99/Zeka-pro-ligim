CREATE TABLE student_profiles (user_id TEXT PRIMARY KEY NOT NULL, profile TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE student_results (
  user_id TEXT NOT NULL, id TEXT NOT NULL, date TEXT NOT NULL, result TEXT NOT NULL,
  PRIMARY KEY (user_id, id)
);
--> statement-breakpoint
CREATE INDEX student_results_date ON student_results (user_id, date DESC);
