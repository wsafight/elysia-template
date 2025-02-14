import type Elysia from "elysia";
import { AddressController } from "./address";
import { TodoController } from "./todo";
import { UserController } from "./user";

export const setupControllers = (app: Elysia) => {
  app.group("/api", (app) => {
    app.use(UserController);
    app.use(TodoController);
    app.use(AddressController);
    return app;
  });
};
