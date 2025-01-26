import { sqliteTable, int, text } from "drizzle-orm/sqlite-core"

/**
 * This is a simple schema for a user table.
 */
export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  firstName: text(),
  role: text().$type<"guest" | "user" | "admin">().default("guest"),
  lastName: text(),
});
