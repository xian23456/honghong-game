import { relations } from "drizzle-orm/relations";
import { users, gameRecords, boyfriendCharacters, chatSessions, chatMessages, generatedImages } from "./schema";

export const gameRecordsRelations = relations(gameRecords, ({one}) => ({
	user: one(users, {
		fields: [gameRecords.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	gameRecords: many(gameRecords),
	chatSessions: many(chatSessions),
}));

export const boyfriendCharactersRelations = relations(boyfriendCharacters, ({many}) => ({
	chatSessions: many(chatSessions),
	generatedImages: many(generatedImages),
}));

export const chatSessionsRelations = relations(chatSessions, ({one, many}) => ({
	user: one(users, {
		fields: [chatSessions.userId],
		references: [users.id]
	}),
	character: one(boyfriendCharacters, {
		fields: [chatSessions.characterId],
		references: [boyfriendCharacters.id]
	}),
	messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({one, many}) => ({
	session: one(chatSessions, {
		fields: [chatMessages.sessionId],
		references: [chatSessions.id]
	}),
	generatedImages: many(generatedImages),
}));

export const generatedImagesRelations = relations(generatedImages, ({one}) => ({
	character: one(boyfriendCharacters, {
		fields: [generatedImages.characterId],
		references: [boyfriendCharacters.id]
	}),
	message: one(chatMessages, {
		fields: [generatedImages.messageId],
		references: [chatMessages.id]
	}),
}));