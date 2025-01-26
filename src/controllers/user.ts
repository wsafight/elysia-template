import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { JWT_NAME } from "../config/constant";
import { useSqlite } from "../lib/db";
import { authPlugin } from "../plugins/auth";
import { UserService } from "../services/user";

export const userController = new Elysia({ prefix: "/user" })
  .decorate("userService", new UserService({ db: useSqlite() }))
  .use(
    jwt({
      name: JWT_NAME,
      secret: "todo",
      exp: "12h",
    }),
  )
  .get("/login", async ({ cookie: { accessToken }, jwt }) => {
    const value = await jwt.sign({ sub: "1" });
    accessToken.set({
      value,
      httpOnly: true,
      maxAge: 7 * 86400,
    });
    return "Successfully logged in";
  })
  .use(authPlugin)
  .get("/logout", async ({ cookie: { accessToken } }) => {
    accessToken.remove();
    return "Successfully logged out";
  })
  .get("/me", async ({ set, user }) => {
    return user;
  });
