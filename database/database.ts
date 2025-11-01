import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Get database connection string from environment variable
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/tododb";

// Create postgres client
const client = postgres(DATABASE_URL);

// Export Drizzle ORM instance
export const orm = drizzle(client);

