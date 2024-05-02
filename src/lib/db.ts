import * as schema from "@/lib/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "server-only";

const connectionString = process.env.DB_URL as string;

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema: schema });

export { db };
