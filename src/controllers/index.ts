import type Elysia from "elysia";
import { todoController } from "./todo";
import { userController } from "./user";

export const setupControllers = (app: Elysia) => {
  app.group("/api", (app) => {
    app.use(userController).use(todoController);
    return app;
  });
};
