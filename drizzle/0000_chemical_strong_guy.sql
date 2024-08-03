DO $$ BEGIN
 CREATE TYPE "public"."service" AS ENUM('grammar', 'content', 'paraphrase', 'seo', 'summarize');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."state" AS ENUM('private', 'public');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(191) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "content" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"outline" text,
	"seo_keyword" text,
	"category_id" varchar(191),
	"state" "state" DEFAULT 'private' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task_board" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kanban_column" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"index" integer NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prompt" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"service" "service",
	"price" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kanban_task" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"column_id" text NOT NULL,
	"board_id" text NOT NULL,
	"assignee" text,
	"index" integer NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "template" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"password" text NOT NULL,
	"picture" text,
	"credits" integer DEFAULT 30 NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content" ADD CONSTRAINT "content_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "content" ADD CONSTRAINT "content_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task_board" ADD CONSTRAINT "task_board_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kanban_column" ADD CONSTRAINT "kanban_column_board_id_task_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."task_board"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompt" ADD CONSTRAINT "prompt_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kanban_task" ADD CONSTRAINT "kanban_task_column_id_kanban_column_id_fk" FOREIGN KEY ("column_id") REFERENCES "public"."kanban_column"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kanban_task" ADD CONSTRAINT "kanban_task_board_id_task_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."task_board"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kanban_task" ADD CONSTRAINT "kanban_task_assignee_user_id_fk" FOREIGN KEY ("assignee") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "template" ADD CONSTRAINT "template_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_user_id_idx" ON "category" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "content_user_id_idx" ON "content" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prompt_user_id_idx" ON "prompt" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "template_user_id_idx" ON "template" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "user" ("email");