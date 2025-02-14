const buildListFunStr = (
  moduleName: string,
  typeName: string,
  currentSchema: Record<string, any>,
) => {
  const keys = Object.keys(currentSchema).filter(
    (x) => !["id", "createdTime", "updatedTime"].includes(x),
  );
  return `
  public list({
    pageSize,
    pageNumber,
    userId,
  }: {
    pageSize: number;
    pageNumber: number;
    userId: number;
  }): Promise<Select${typeName}[]> {
    return this.db.query.${moduleName}.findMany({
      where: (${moduleName}, { eq }) => eq(${moduleName}.userId, userId),
      limit: pageSize,
      offset: pageSize * (pageNumber - 1),
    });
  }
  `;
};

const buildAddFunStr = (
  moduleName: string,
  typeName: string,
  currentSchema: Record<string, any>,
) => {
  const keys = Object.keys(currentSchema).filter(
    (x) => !["id", "createdTime", "updatedTime"].includes(x),
  );
  return `
    public add({ ${keys.join(",")} }: Insert${typeName}) {
      return this.db
        .insert(${moduleName})
        .values({
          ${keys.join(",")}
        })
        .returning({ id: ${moduleName}.id });
    }
      `;
};

const buildUpdateFunStr = (
  moduleName: string,
  typeName: string,
  currentSchema: Record<string, any>,
) => {
  const keys = Object.keys(currentSchema).filter(
    (x) => !["id", "userId", "createdTime", "updatedTime"].includes(x),
  );
  const ifSnippets = keys
    .map((item) => {
      const type = currentSchema[item].type;
      if (type === "string") {
        return `
          if (typeof ${item} === "string") {
              changed.${item} = ${item};
          }
        `;
      } else if (type === "number") {
        return `
          if (typeof ${item} === "number") {
              changed.${item} = ${item};
          }
        `;
      } else if (type === "boolean") {
        return `
          if (typeof ${item} === "boolean") {
              changed.${item} = ${item};
          }
        `;
      }
    })
    .join("");
  return `
    public update({ id, userId, ${keys} }: Update${typeName}) {
    const changed: Partial<Update${typeName}> = {};

    ${ifSnippets}

    if (Object.keys(changed).length === 0) {
      return;
    }

    return this.db
      .update(${moduleName})
      .set(changed)
      .where(and(eq(${moduleName}.userId, userId), eq(${moduleName}.id, id)));
  }
    `;
};

const buildDeleteFunStr = (
  moduleName: string,
  typeName: string,
  currentSchema: Record<string, any>,
) => {
  return `
    public delete({
      id,
      userId,
    }: {
      id: number;
      userId: number;
    }) {
      return this.db
        .delete(${moduleName})
        .where(and(eq(${moduleName}.id, id), eq(${moduleName}.userId, userId)))
        .limit(1);
    }
  `;
};

export const buildServiceFile = (
  moduleName: string,
  typeName: string,
  currentSchema: Record<string, any>,
) => {
  return `
import { and, eq } from "drizzle-orm";
import type { Sqlite } from "../lib/db";
import { ${moduleName} } from "../schema";

type Select${typeName} = typeof ${moduleName}.$inferSelect;
type Insert${typeName} = typeof ${moduleName}.$inferInsert;
type Update${typeName} = Insert${typeName} & { id: number }

class ${typeName}Service {
  private db: Sqlite;
  constructor({ db }: { db: Sqlite }) {
    this.db = db;
  }

  ${buildListFunStr(moduleName, typeName, currentSchema)}

  ${buildAddFunStr(moduleName, typeName, currentSchema)}

  ${buildUpdateFunStr(moduleName, typeName, currentSchema)}
  
  ${buildDeleteFunStr(moduleName, typeName, currentSchema)}
}

export { ${typeName}Service };
`;
};
