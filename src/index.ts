import jwt from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { JWT_NAME } from "./config/constant";
import { userController } from "./controllers/user";

const isProduction = Bun.env.NODE_ENV === "production";

function bootstrap() {
  const app = new Elysia();

  if (!isProduction) {
    app.use(swagger());
  }

  app.use(
    jwt({
      name: JWT_NAME,
      secret: "todo",
      exp: "12h",
      //  Bun.env.JWT_SECRET!,
    }),
  );

  app.group("/api", (app) => app.use(userController)).listen(3000);
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
  );
  return app;
}

bootstrap();
