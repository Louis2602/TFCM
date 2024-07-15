DO $$ BEGIN
 CREATE TYPE "public"."state" AS ENUM('private', 'public');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "card_flairs" (
	"card_id" varchar(20) PRIMARY KEY NOT NULL,
	"flair" varchar(100) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kanban_cards" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"column" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"create_at" timestamp DEFAULT now() NOT NULL,
	"update_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "content" ADD COLUMN "state" "state" DEFAULT 'private' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "card_flairs" ADD CONSTRAINT "card_flairs_card_id_kanban_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."kanban_cards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "card_tag_idx" ON "card_flairs" ("card_id","flair");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "column_index" ON "kanban_cards" ("column");