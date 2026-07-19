import { defineConfig } from "drizzle-kit";

try {
  // Loads lib/db/.env if present. Wrapped in try/catch since this throws
  // when the file doesn't exist — fine in CI/production, where DATABASE_URL
  // is already set directly as a real environment variable.
  process.loadEnvFile();
} catch {
  // no local .env file — ignore
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Ensure the database is provisioned."
  );
}

export default defineConfig({
  schema: "./src/schema/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});