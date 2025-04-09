import type Elysia from "elysia";
import { AddressController } from "./address";
import { UserController } from "./user";
import { TodoController } from "./todo";

export const setupControllers = (app: Elysia) => {
  app.group("/api", (app) => {
    app.use(UserController);
    app.use(TodoController);
    app.use(AddressController);
    return app;
  });
};
