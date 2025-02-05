import { serverTiming } from "@elysiajs/server-timing";
import { swagger } from "@elysiajs/swagger";
import type { Elysia } from "elysia";

export const setupDevPlugins = (app: Elysia) => {
  app.use(swagger());
  app.use(serverTiming());
};
