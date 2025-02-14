
// TODO
const buildListStr = (
  smallTypeName: string,
  currentSchema: Record<string, any>
) => {
  return `async ({ body: { pageNumber, pageSize }, ${smallTypeName}Service, user }) => {
        return ${smallTypeName}Service.list({
          pageSize: pageSize ?? 10,
          pageNumber: pageNumber ?? 1,
          userId: user.id,
        });
      },
      {
        body: t.Object({
          pageNumber: t.Optional(t.Number({ minimum: 1 })),
          pageSize: t.Optional(t.Number({ minimum: 1 })),
        }),
      },
  `;
};

const getTTypeBySchemaType = (tType: string) => {
  return {
    string: "String",
    boolean: "Boolean",
    number: "Number"
  }[tType];
};

const buildAddStr = (
  smallTypeName: string,
  currentSchema: Record<string, any>
) => {
  const keys = Object.keys(currentSchema)
    .filter((item) => !["id", "userId", "createdTime", "updatedTime"].includes(item))
  const buildBody = keys.map((item) => {
      const { type, require, defaultVal } = currentSchema[item];
      const tType = getTTypeBySchemaType(type);
      if (!tType) {
        throw new Error("error tType");
      }
      let current = "";
      // 不是必须或者有默认值
      if (!require || defaultVal) {
        current = `${item}: t.Optional(t.${tType}())`;
      } else {
        current = `${item}: t.${tType}()`;
      }
      return current
    }).join(',');

  return `async ({ ${smallTypeName}Service, body: { ${keys.join(',')} }, user }) => {
        return ${smallTypeName}Service.add({ userId: user.id, ${keys.join(',')} });
      },
      {
        body: t.Object({
         ${buildBody}
        }),
      },
  `;
};

const buildUpdateStr = (
  smallTypeName: string,
  currentSchema: Record<string, any>
) => {
  const keys = Object.keys(currentSchema)
    .filter((item) => !["id", "userId", "createdTime", "updatedTime"].includes(item))
    const buildBody = keys.map((item) => {
      const { type, require, defaultVal } = currentSchema[item];
      const tType = getTTypeBySchemaType(type);
      if (!tType) {
        throw new Error("error tType");
      }
      return `${item}: t.Optional(t.${tType}())`;
    }).join(',');
    return `({ ${smallTypeName}Service, body: { id, ${keys.join(',')} }, user }) => {
        return ${smallTypeName}Service.update({ id, userId: user.id, ${keys.join(',')} });
      },
      {
        body: t.Object({
        id: t.Number(),
        ${buildBody}
        }),
      },
  `
}

export const buildControllerFile = (
  moduleName: string,
  typeName: string,
  currentSchema: Record<string, any>
) => {
  const smallTypeName = typeName.toLowerCase();
  return `
  import { Elysia, t } from "elysia";
  import { useSqlInstance } from "../lib/db";
  import { authPlugin } from "../plugins/auth";
  import { ${typeName}Service } from "../services";

  export const ${typeName}Controller = new Elysia({ prefix: "/${typeName.toLocaleLowerCase()}" })
    .decorate("${smallTypeName}Service", new ${typeName}Service({ db: useSqlInstance() }))
    .use(authPlugin)
    .post(
      "/list",
      ${buildListStr(smallTypeName, currentSchema)}
    )
    .post(
      "/add",
      ${buildAddStr(smallTypeName, currentSchema)}
    )
    .post(
      "/update",
      ${buildUpdateStr(smallTypeName, currentSchema)}
    )
    .post(
      "/delete",
      async ({ ${smallTypeName}Service, body: { id }, user }) => {
        return ${smallTypeName}Service.delete({ id, userId: user.id });
      },
      {
        body: t.Object({
          id: t.Number(),
        }),
      },
    );
  `;
};
