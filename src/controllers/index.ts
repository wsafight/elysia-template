import type Elysia from "elysia";
import { userController } from "./user";

export const setupControllers = (app: Elysia) => {
  app.group("/api", (app) => app.use(userController));
};
