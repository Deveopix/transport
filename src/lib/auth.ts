import { db } from "@/lib/db";
import { TB_session, TB_user, UserViewType } from "@/lib/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import "server-only";

const adapter = new DrizzlePostgreSQLAdapter(db, TB_session, TB_user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (attributes) => {
		return {
			...attributes,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: UserViewType;
	}
}
