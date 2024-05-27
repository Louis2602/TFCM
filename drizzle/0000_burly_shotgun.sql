DO $$ BEGIN
 CREATE TYPE "public"."service" AS ENUM('grammar', 'content', 'paraphrase', 'seo', 'summarize');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"attributes" json NOT NULL,
	CONSTRAINT "account_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prompt" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"service" "service",
	"price" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"account_id" varchar(191) NOT NULL,
	"email" varchar(191) NOT NULL,
	"image_url" text,
	"credits" integer DEFAULT 30 NOT NULL,
	"first_name" varchar(191),
	"last_name" varchar(191),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_account_id_unique" UNIQUE("account_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "prompt" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "user" ("email");