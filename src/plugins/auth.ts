import type Elysia from "elysia";
import { useSqlite } from "../lib/db";

const authPlugin = (app: Elysia) =>
  app.derive(async ({ jwt, cookie: { accessToken }, set }) => {
    if (!accessToken?.value) {
      // handle error for access token is not available
      set.status = "Unauthorized";
      throw new Error("Access token is missing");
    }
    const jwtPayload = await jwt.verify(accessToken.value);
    if (!jwtPayload) {
      // handle error for access token is tempted or incorrect
      set.status = "Forbidden";
      throw new Error("Access token is invalid");
    }

    const userId = jwtPayload.sub;

    // todo, 此处密码不应该返回，后续需要处理
    const user = await useSqlite().query.users.findFirst({
      where: (users, { eq }) => eq(users.id, Number(userId)),
      columns: {
        password: false, //ignored
      },
    });

    if (!user) {
      // handle error for user not found from the provided access token
      set.status = "Forbidden";
      throw new Error("Access token is invalid");
    }

    return {
      user,
    };
  });

export { authPlugin };
