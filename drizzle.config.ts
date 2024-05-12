import { config } from "dotenv";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

if (!process.env.DB_URL) {
	throw new Error("DB_URL environment variable is required.");
}

export default defineConfig({
	schema: "./src/lib/schema.ts",
	out: "./src/lib/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DB_URL!,
	},
});
