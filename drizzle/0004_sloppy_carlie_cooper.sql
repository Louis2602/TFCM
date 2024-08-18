CREATE TABLE IF NOT EXISTS "seo-wizard" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"used" integer DEFAULT 0 NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seo-wizard" ADD CONSTRAINT "seo-wizard_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trending_user_id_idx" ON "seo-wizard" ("user_id");