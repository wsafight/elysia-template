import jwt from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { JWT_NAME } from "./config/constant";
import { userController } from "./controllers";

const isProduction = Bun.env.NODE_ENV === "production";

function bootstrap() {
  const app = new Elysia();

  if (!isProduction) {
    app.use(swagger());
  }

  app.use(
    jwt({
      name: JWT_NAME,
      // TODO: 使用环境变量 Bun.env.JWT_SECRET
      secret: "todo",
      exp: "12h",
    }),
  );

  app.group("/api", (app) => app.use(userController)).listen(3000);
  return app;
}

bootstrap();
