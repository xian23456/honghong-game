CREATE TABLE "boyfriend_characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer NOT NULL,
	"occupation" text NOT NULL,
	"avatar_url" text,
	"personality" text NOT NULL,
	"speaking_style" text NOT NULL,
	"interests" text NOT NULL,
	"greeting" text NOT NULL,
	"system_prompt" text NOT NULL,
	"voice_id" varchar(100) NOT NULL,
	"voice_params" jsonb,
	"appearance_prompt" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "boyfriend_characters_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chat_messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"session_id" bigint NOT NULL,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"audio_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chat_messages_role_check" CHECK (role = ANY (ARRAY['user'::text, 'assistant'::text]))
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "chat_sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"character_id" integer NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	CONSTRAINT "chat_sessions_status_check" CHECK (status = ANY (ARRAY['active'::text, 'ended'::text]))
);
--> statement-breakpoint
CREATE TABLE "generated_images" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "generated_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"character_id" integer NOT NULL,
	"message_id" bigint,
	"trigger_type" varchar(20) NOT NULL,
	"scene_prompt" text NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "generated_images_trigger_type_check" CHECK (trigger_type = ANY (ARRAY['proactive'::text, 'requested'::text]))
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_character_id_boyfriend_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."boyfriend_characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_images" ADD CONSTRAINT "generated_images_character_id_boyfriend_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."boyfriend_characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_images" ADD CONSTRAINT "generated_images_message_id_chat_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."chat_messages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_messages_session_idx" ON "chat_messages" USING btree ("session_id" int8_ops,"created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "chat_sessions_user_character_idx" ON "chat_sessions" USING btree ("user_id" int8_ops,"character_id" int4_ops);
