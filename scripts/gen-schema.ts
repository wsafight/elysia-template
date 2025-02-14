import { EOL } from "node:os";
import { $ } from "bun";
import schema from "../schema.json" with { type: "json" };

const importContent = `
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
`;

const content = Object.values(schema)
  .map((item) => {
    const { _wrapper, ...other } = item;
    const wrapperFront = `
    export const ${_wrapper} = sqliteTable(
      "${_wrapper}",
    {
    `;
    console.log(other);

    const last = `
},
)
    `;
    return [wrapperFront, last].join("");
  })
  .join(EOL);

// export const users = sqliteTable(
//   "users",
//   {
//     id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
//     name: text().notNull(),
//     nickName: text(),
//     password: text().notNull(),
//     role: text().$type<"guest" | "user" | "admin">().default("guest"),
//     email: text().notNull(),
//   },
//   (t) => [index("IDX_NAME").on(t.name), uniqueIndex("IDX_EMAIL").on(t.email)],
// );

await Bun.write("src/bb.ts", [importContent, content].join(""));

await $`bun format`;
