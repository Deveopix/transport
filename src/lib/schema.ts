import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const TB_user = pgTable("user", {
	id: text("id").primaryKey(),
	username: text("username").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
});

export const RE_user = relations(TB_user, ({ many }) => ({
	tripVotes: many(TB_tripVote),
}));

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

export const TB_trip = pgTable(
	"trip",
	{
		id: text("id").primaryKey(),
		managerId: text("manger_id")
			.notNull()
			.references(() => TB_user.id),
		published: boolean("published").notNull(),
		createdDate: timestamp("created_date", {
			withTimezone: true,
			mode: "date",
		})
			.notNull()
			.defaultNow(),
		name: text("name"),
		voteEnd: timestamp("vote_end", {
			withTimezone: true,
			mode: "date",
		}),
		tripDate: timestamp("trip_date", {
			withTimezone: true,
			mode: "date",
		}),
		notes: text("notes"),
	},
	(table) => ({ mangerIdIdx: index("manager_id_idx").on(table.managerId) }),
);

export const RE_trip = relations(TB_trip, ({ many, one }) => ({
	tripTimes: many(TB_tripTime),
	manager: one(TB_user, {
		fields: [TB_trip.managerId],
		references: [TB_user.id],
	}),
}));

export const TB_tripTime = pgTable(
	"trip_time",
	{
		id: text("id").primaryKey(),
		tripId: text("trip_id")
			.notNull()
			.references(() => TB_trip.id, { onDelete: "cascade" }),
		time: timestamp("time", {
			withTimezone: true,
			mode: "date",
		}).notNull(),
		isBackward: boolean("is_backward").notNull(),
	},
	(table) => ({ tripIdIdx: index("trip_id_idx").on(table.tripId) }),
);

export const RE_tripTime = relations(TB_tripTime, ({ many, one }) => ({
	trip: one(TB_trip, {
		fields: [TB_tripTime.tripId],
		references: [TB_trip.id],
	}),
	tripVotes: many(TB_tripVote),
}));

export const TB_tripVote = pgTable(
	"trip_vote",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => TB_user.id, { onDelete: "cascade" }),
		forwardTripTimeId: text("forward_trip_time_id")
			.notNull()
			.references(() => TB_tripTime.id, { onDelete: "cascade" }),
		backwardTripTimeId: text("backward_trip_time_id")
			.notNull()
			.references(() => TB_tripTime.id, { onDelete: "cascade" }),
	},
	(table) => ({
		mainIdx: uniqueIndex("main_idx").on(
			table.forwardTripTimeId,
			table.backwardTripTimeId,
		),
	}),
);

export const RE_tripVote = relations(TB_tripVote, ({ one }) => ({
	forwardTripTime: one(TB_tripTime, {
		fields: [TB_tripVote.forwardTripTimeId],
		references: [TB_tripTime.id],
	}),
	backwardTripTime: one(TB_tripTime, {
		fields: [TB_tripVote.backwardTripTimeId],
		references: [TB_tripTime.id],
	}),
	user: one(TB_user, {
		fields: [TB_tripVote.userId],
		references: [TB_user.id],
	}),
}));

export const userSchema = createSelectSchema(TB_user);
export const userViewSchema = userSchema.pick({ username: true, email: true });

export type UserType = z.infer<typeof userSchema>;
export type UserViewType = z.infer<typeof userViewSchema>;

export type Trip = typeof TB_trip.$inferSelect;
export type TripTime = typeof TB_tripTime.$inferSelect;
