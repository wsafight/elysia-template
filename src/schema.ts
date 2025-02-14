import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const userExt = {
  createdUser: integer({ mode: "number" }),
  updatedUser: integer({ mode: "number" }),
};

/**
 * This is a simple schema for a user table.
 */
export const users = sqliteTable(
  "users",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    nickName: text(),
    password: text().notNull(),
    role: text().$type<"guest" | "user" | "admin">().default("guest"),
    email: text().notNull(),
  },
  (t) => [index("IDX_name").on(t.name), uniqueIndex("IDX_email").on(t.email)],
);

export const todos = sqliteTable(
  "todos",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: integer({ mode: "number" }).notNull(),
    description: text().default("todo"),
    isDone: integer({
      mode: "boolean",
    }).default(false),
    createdTime: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedTime: integer({ mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (t) => [index("IDX_userId").on(t.userId)],
);
