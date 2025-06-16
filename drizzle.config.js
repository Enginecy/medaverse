import { defineConfig } from "drizzle-kit";

const base = "./src/db";
/**
 * @type {import("drizzle-kit").Config}
 */
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_URL,
  },
  schema: `${base}/schema.ts`,
  out: `${base}`,
  verbose: false,
  schemaFilter: ["public"],
  strict: true,
  casing: "snake_case",
  migrations: {
    prefix: "timestamp",
  },
  entities: {
    roles: {
      provider: "supabase",
      exclude: ["supabase_auth_admin"],
    },
  },
});
