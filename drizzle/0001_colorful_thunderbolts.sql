CREATE TABLE IF NOT EXISTS "content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "user_id_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_user_id_idx" ON "content" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompt_user_id_idx" ON "prompt" ("user_id");