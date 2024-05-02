import { config } from "dotenv";
import "dotenv/config";
import type { Config } from "drizzle-kit";

config({ path: ".env.local" });

if (!process.env.DB_URL) {
	throw new Error("DB_URL environment variable is required.");
}

export default {
	schema: "./src/lib/schema.ts",
	out: "./src/lib/migrations",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DB_URL!,
	},
} satisfies Config;
