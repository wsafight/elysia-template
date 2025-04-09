import { EOL } from "node:os";
import { $ } from "bun";
import schema from "../schema.json" with { type: "json" };
import { genImport } from "knitwork";


// only support sqlite now

const importContent = genImport("drizzle-orm/sqlite-core", ["index", "integer", "sqliteTable", "text", "uniqueIndex"])

const content = Object.keys(schema)
  .map((item: any) => {
    const wrapperFront = `
    export const ${item} = sqliteTable(
      "${item}",
    {
    `;
    const tableSchema = (schema as Record<string, any>)[item];
    const indexesStr: string[] = [];
    const tableSchemaStr: string[] = [];
    Object.keys(tableSchema).forEach((item) => {
      const currentSchema = tableSchema[item];

      if (currentSchema === "primaryKey") {
        tableSchemaStr.push(
          `${item}: integer({ mode: "number" }).primaryKey({ autoIncrement: true })`,
        );
      } else if (currentSchema === "time") {
        tableSchemaStr.push(
          `${item}: integer({ mode: "timestamp_ms" })`,
        );
      } else if (currentSchema === "time!") {
        tableSchemaStr.push(
          `${item}: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date())`,
        );
      } else if (currentSchema === "time!!") {
        tableSchemaStr.push(
          `${item}: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()).$onUpdateFn(() => new Date())`,
        );
      } else if (typeof currentSchema === "object") {
        const { type, require, index, uniqueIndex, defaultVal, enums } =
          tableSchema[item];

        let current = "";
        if (type === "string") {
          current = `${item}: text()`;
        } else if (type === "enum") {
          current = `${item}: text()`;
          const enumsStr = enums.map((item: string) => `"${item}"`).join(" | ");
          current += `.$type<${enumsStr}>()`;
        } else if (type === "number") {
          current = `${item}: integer({ mode: "number" })`;
        } else if (type === "boolean") {
          current = `${item}: integer({ mode: "boolean" })`;
        }
        if (require) {
          current += ".notNull()";
        }
        if (defaultVal) {
          current += `.default(${defaultVal})`;
        }

        tableSchemaStr.push(current);
        if (index) {
          indexesStr.push(`index("${index}").on(t.${item})`);
        } else if (uniqueIndex) {
          indexesStr.push(`uniqueIndex("${uniqueIndex}").on(t.${item})`);
        }
      }
    });
    const last = `
},
  (t) => [${indexesStr.join(",")}]
)
    `;
    return [wrapperFront, tableSchemaStr.join(","), last].join("");
  })
  .join(EOL);

await Bun.write("src/schema.ts", [importContent, content].join(EOL));

await $`bun format`;
