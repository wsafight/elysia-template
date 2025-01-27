import {
  index,
  int,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/**
 * This is a simple schema for a user table.
 */
export const users = sqliteTable(
  "users",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    nickName: text(),
    password: text().notNull(),
    role: text().$type<"guest" | "user" | "admin">().default("guest"),
    email: text().notNull(),
  },
  (t) => [index("name").on(t.name), uniqueIndex("email").on(t.email)],
);
