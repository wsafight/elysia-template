import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema.ts",
  casing: 'snake_case',
  out: "./drizzle",
  dbCredentials: {
    url: "sqlite.db", 
  }
});