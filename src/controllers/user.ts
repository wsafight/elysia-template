import { Elysia, t } from "elysia";
import { JWT_AGE } from "../config/constant";
import { useSqlInstance } from "../lib/db";
import { authPlugin } from "../plugins/auth";
import { UserService } from "../services";

export const UserController = new Elysia({ prefix: "/user" })
  .decorate("userService", new UserService({ db: useSqlInstance() }))
  .post(
    "/register",
    async ({ body: { name, email, password }, userService, error }) => {
      const current = await userService.hasEmailUser({ email });
      if (current) {
        return error(401, "email 已被使用");
      }

      const hashPassword = await Bun.password.hash(
        `${password}${Bun.env.passwordHalt ?? "halt"}`,
      );
      return userService.createUser({ name, email, password: hashPassword });
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 8 }),
      }),
    },
  )
  .post(
    "/loginByEmail",
    async ({
      error,
      cookie: { accessToken },
      userService,
      body: { email, password },
      loginJwt,
    }) => {
      const current = await userService.loginByPassword({ email });
      if (!current) {
        return error(401, "email或者密码输错");
      }

      const isPasswordVerify = await Bun.password.verify(
        `${password}${Bun.env.passwordHalt ?? "halt"}`,
        current.password,
      );

      if (!isPasswordVerify) {
        return error(401, "email或者密码输错");
      }
      const value = await loginJwt.sign({ sub: current.id });
      accessToken.set({
        value,
        httpOnly: true,
        sameSite: "strict",
        maxAge: JWT_AGE,
      });
      return "登录成功";
    },
    {
      body: t.Object({
        password: t.String({ minLength: 8 }),
        email: t.String({ format: "email" }),
      }),
    },
  )
  .post("/logout", async ({ cookie: { accessToken } }) => {
    accessToken.remove();
    return "Successfully logged out";
  })
  .use(authPlugin)

  .get("/me", async ({ user }) => user);
