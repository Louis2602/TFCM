DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'declinced');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN "status" "status" DEFAULT 'pending' NOT NULL;