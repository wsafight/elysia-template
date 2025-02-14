import { Elysia, t } from "elysia";
import { useSqlInstance } from "../lib/db";
import { authPlugin } from "../plugins/auth";
import { DepartmentService } from "../services";

export const DepartmentController = new Elysia({ prefix: "/department" })
  .decorate(
    "departmentService",
    new DepartmentService({ db: useSqlInstance() }),
  )
  .use(authPlugin)
  .post(
    "/list",
    async ({ body: { pageNumber, pageSize }, departmentService, user }) => {
      return departmentService.list({
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
    async ({ departmentService, body: { country, city }, user }) => {
      return departmentService.add({ userId: user.id, country, city });
    },
    {
      body: t.Object({
        country: t.String(),
        city: t.String(),
      }),
    },
  )
  .post(
    "/update",
    ({ departmentService, body: { id, country, city }, user }) => {
      return departmentService.update({ id, userId: user.id, country, city });
    },
    {
      body: t.Object({
        id: t.Number(),
        country: t.Optional(t.String()),
        city: t.Optional(t.String()),
      }),
    },
  )
  .post(
    "/delete",
    async ({ departmentService, body: { id }, user }) => {
      return departmentService.delete({ id, userId: user.id });
    },
    {
      body: t.Object({
        id: t.Number(),
      }),
    },
  );
