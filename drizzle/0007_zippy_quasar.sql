DO $$ BEGIN
 CREATE TYPE "public"."state" AS ENUM('private', 'public');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN "state" "state" DEFAULT 'private' NOT NULL;