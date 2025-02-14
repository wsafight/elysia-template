import { Elysia, t } from "elysia";
import { useSqlInstance } from "../lib/db";
import { authPlugin } from "../plugins/auth";
import { TodoService } from "../services";

export const todoController = new Elysia({ prefix: "/todo" })
  .decorate("todoService", new TodoService({ db: useSqlInstance() }))
  .use(authPlugin)
  .post(
    "/list",
    async ({ body: { pageNumber, pageSize }, todoService, user }) => {
      return todoService.list({
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
  )
  .post(
    "/add",
    async ({ todoService, body: { description }, user }) => {
      return todoService.add({ userId: user.id, description });
    },
    {
      body: t.Object({
        description: t.String({ minLength: 3 }),
      }),
    },
  )

  .post(
    "/update",
    async ({ todoService, body: { id, description, isDone }, user }) => {
      return todoService.update({ id, userId: user.id, description, isDone });
    },
    {
      body: t.Object({
        id: t.Number(),
        description: t.Optional(t.String()),
        isDone: t.Optional(t.Boolean()),
      }),
    },
  )
  .post(
    "/delete",
    async ({ todoService, body: { id }, user }) => {
      return todoService.delete({ id, userId: user.id });
    },
    {
      body: t.Object({
        id: t.Number(),
      }),
    },
  );
