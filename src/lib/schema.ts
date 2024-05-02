import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import "server-only";
import { z } from "zod";

export const TB_user = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
});

export const TB_session = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => TB_user.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export const userSchema = createSelectSchema(TB_user);
export const userViewSchema = userSchema.pick({ username: true, email: true });

export type UserType = z.infer<typeof userSchema>;
export type UserViewType = z.infer<typeof userViewSchema>;
