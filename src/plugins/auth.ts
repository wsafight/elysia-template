import type Elysia from "elysia";
import { useSqlInstance } from "../lib/db";

export const authPlugin = (app: Elysia) =>
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

    const user = await useSqlInstance().query.users.findFirst({
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
