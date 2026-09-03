ALTER TABLE "game_records" ALTER COLUMN "final_score" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "game_records" ADD COLUMN "rounds" integer DEFAULT 0 NOT NULL;