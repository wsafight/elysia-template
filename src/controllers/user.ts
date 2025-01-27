import { Elysia } from "elysia";
import { useSqlite } from "../lib/db";
import { authPlugin } from "../plugins/auth";
import { UserService } from "../services";

export const userController = new Elysia({ prefix: "/user" })
  .decorate("userService", new UserService({ db: useSqlite() }))
  .get("/login", async ({ cookie: { accessToken }, jwt, userService }) => {
    
    const value = await jwt.sign({ sub: "1" });
    accessToken.set({
      value,
      httpOnly: true,
      maxAge: 7 * 86400,
    });
    return userService.createUser({ firstName: "John", lastName: "Doe" });
  })
  .use(authPlugin)
  .get("/logout", async ({ cookie: { accessToken } }) => {
    accessToken.remove();
    return "Successfully logged out";
  })
  .get("/me", async ({ set, user }) => {
    return user;
  });
