import { pgTable, serial, timestamp, index, varchar, text, unique, bigint, foreignKey, check, integer, boolean, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
	id: serial().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	summary: text().notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("blog_posts_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
]);

export const users = pgTable("users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	username: text().notNull(),
	password: text().notNull(),
	// TODO: 最小角色系统，admin 可访问 /admin 后台（需手动在数据库中将用户 role 改为 admin）
	role: varchar({ length: 20 }).notNull().default("user"),
	// 账号状态：active=正常，banned=封禁
	status: varchar({ length: 20 }).notNull().default("active"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_username_key").on(table.username),
	check("users_role_check", sql`role = ANY (ARRAY['user'::text, 'admin'::text])`),
	check("users_status_check", sql`status = ANY (ARRAY['active'::text, 'banned'::text])`),
]);

export const gameRecords = pgTable("game_records", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "game_records_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	scenario: text().notNull(),
	// 旧字段：通关时愤怒值必为 0，已废弃，改用 rounds 排名
	finalScore: integer("final_score").notNull().default(0),
	// 本局对话轮数（用户消息数），排行榜按轮数升序排名（越少越靠前）
	rounds: integer("rounds").notNull().default(0),
	result: text().notNull(),
	playedAt: timestamp("played_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "game_records_user_id_fkey"
		}).onDelete("cascade"),
	check("game_records_result_check", sql`result = ANY (ARRAY['success'::text, 'failure'::text, 'ended'::text])`),
]);

// ========== 纸片人男友 ==========

// 男友角色表：三个固定虚拟男友的全部设定
export const boyfriendCharacters = pgTable("boyfriend_characters", {
	id: serial().primaryKey().notNull(),
	// 角色代号：athlete(体育生) / ceo(高富帅) / artist(文艺青年)
	code: varchar({ length: 50 }).notNull().unique(),
	name: varchar({ length: 100 }).notNull(),
	age: integer().notNull(),
	occupation: text().notNull(),
	avatarUrl: text("avatar_url"),
	personality: text().notNull(),
	speakingStyle: text("speaking_style").notNull(),
	interests: text().notNull(),
	greeting: text().notNull(),
	// 完整 LLM 角色 prompt，保证角色一致性
	systemPrompt: text("system_prompt").notNull(),
	// TTS 音色 ID，三个角色声音明显不同
	voiceId: varchar("voice_id", { length: 100 }).notNull(),
	// 语速、音量等 TTS 参数
	voiceParams: jsonb("voice_params"),
	// 外貌固定描述：每次生图拼进 prompt，保证是同一个人
	appearancePrompt: text("appearance_prompt").notNull(),
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// 聊天会话表：一个用户对一个男友的一次连续聊天
export const chatSessions = pgTable("chat_sessions", {
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "chat_sessions_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	userId: bigint("user_id", { mode: "number" }).notNull().references(() => users.id, { onDelete: "cascade" }),
	characterId: integer("character_id").notNull().references(() => boyfriendCharacters.id, { onDelete: "cascade" }),
	// active=进行中，ended=已结束（切换男友时结束旧会话）
	status: varchar({ length: 20 }).notNull().default("active"),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("chat_sessions_user_character_idx").using("btree", table.userId.asc().nullsLast().op("int8_ops"), table.characterId.asc().nullsLast().op("int4_ops")),
	check("chat_sessions_status_check", sql`status = ANY (ARRAY['active'::text, 'ended'::text])`),
]);

// 聊天消息表：会话内的每条消息（含 AI 语音地址）
export const chatMessages = pgTable("chat_messages", {
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "chat_messages_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	sessionId: bigint("session_id", { mode: "number" }).notNull().references(() => chatSessions.id, { onDelete: "cascade" }),
	// user=用户发的，assistant=AI 男友回复的
	role: varchar({ length: 20 }).notNull(),
	content: text().notNull(),
	// 该条 AI 消息对应的语音地址
	audioUrl: text("audio_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("chat_messages_session_idx").using("btree", table.sessionId.asc().nullsLast().op("int8_ops"), table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	check("chat_messages_role_check", sql`role = ANY (ARRAY['user'::text, 'assistant'::text])`),
]);

// 生成图片表：AI 男友生活照片的生成记录
export const generatedImages = pgTable("generated_images", {
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "generated_images_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	characterId: integer("character_id").notNull().references(() => boyfriendCharacters.id, { onDelete: "cascade" }),
	// 关联哪条消息带的图（可空，图片可能没发出去）
	messageId: bigint("message_id", { mode: "number" }).references(() => chatMessages.id, { onDelete: "set null" }),
	// proactive=AI 主动发，requested=用户要求
	triggerType: varchar("trigger_type", { length: 20 }).notNull(),
	// 本次生成的场景描述（健身房/晚霞/餐厅…）
	scenePrompt: text("scene_prompt").notNull(),
	imageUrl: text("image_url").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	check("generated_images_trigger_type_check", sql`trigger_type = ANY (ARRAY['proactive'::text, 'requested'::text])`),
]);
