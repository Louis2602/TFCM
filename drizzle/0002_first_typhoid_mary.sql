DROP TABLE "account";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_account_id_unique";--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "content" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "prompt" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "account_id";