import jwt from "@elysiajs/jwt";
import type Elysia from "elysia";
import { JWT_NAME } from "../config/constant";

export const setupJwt = (app: Elysia) => {
  app.use(
    jwt({
      name: JWT_NAME,
      // TODO: 使用环境变量 Bun.env.JWT_SECRET
      secret: "todo",
      exp: "12h",
    }),
  );
};
