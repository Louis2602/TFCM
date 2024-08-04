ALTER TABLE "content" ADD COLUMN "review_comment" text;--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN "reviewed_at" timestamp;--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN "reviewed_by" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content" ADD CONSTRAINT "content_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_reviewed_by_idx" ON "content" ("reviewed_by");