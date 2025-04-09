import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable(
  "user",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    nickName: text(),
    password: text().notNull(),
    role: text().$type<"guest" | "user" | "admin">().default("guest"),
    email: text().notNull(),
  },
  (t) => [
    index("IDX_USER_NAME").on(t.name),
    uniqueIndex("IDX_USER_EMAIL").on(t.email),
  ],
);

export const todo = sqliteTable(
  "todo",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: integer({ mode: "number" }).notNull(),
    description: text().default("todo"),
    isDone: integer({ mode: "boolean" }).default(false),
    createdTime: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedTime: integer({ mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (t) => [index("IDX_TODO_USERID").on(t.userId)],
);

export const address = sqliteTable(
  "address",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: integer({ mode: "number" }).notNull(),
    country: text().notNull(),
    city: text().notNull(),
    createdTime: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedTime: integer({ mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (t) => [index("IDX_ADDRESS_USERID").on(t.userId)],
);

export const department = sqliteTable(
  "department",
  {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: integer({ mode: "number" }).notNull(),
    country: text().notNull(),
    city: text().notNull(),
    createdTime: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
    updatedTime: integer({ mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (t) => [index("IDX_DEPARTMENT_USERID").on(t.userId)],
);
