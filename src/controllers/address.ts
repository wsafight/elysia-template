import { Elysia, t } from "elysia";
import { useSqlInstance } from "../lib/db";
import { authPlugin } from "../plugins/auth";
import { AddressService } from "../services";

export const AddressController = new Elysia({ prefix: "/address" })
  .decorate("addressService", new AddressService({ db: useSqlInstance() }))
  .use(authPlugin)
  .post(
    "/list",
    async ({ body: { pageNumber, pageSize }, addressService, user }) => {
      return addressService.list({
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
    async ({ addressService, body: { country, city }, user }) => {
      return addressService.add({ userId: user.id, country, city });
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
    ({ addressService, body: { id, country, city }, user }) => {
      return addressService.update({ id, userId: user.id, country, city });
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
    async ({ addressService, body: { id }, user }) => {
      return addressService.delete({ id, userId: user.id });
    },
    {
      body: t.Object({
        id: t.Number(),
      }),
    },
  );
