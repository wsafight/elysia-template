import { cors } from "@elysiajs/cors";
import jwt from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { JWT_NAME } from "./config/constant";
import { userController } from "./controllers";

const isProduction = Bun.env.NODE_ENV === "production";

function bootstrap() {
  const app = new Elysia();

  if (!isProduction) {
    app.use(swagger());
  }

  // 安全防护
  app.use(helmet());

  // 配置跨域
  app.use(cors());

  // JWT 验证
  app.use(
    jwt({
      name: JWT_NAME,
      // TODO: 使用环境变量 Bun.env.JWT_SECRET
      secret: "todo",
      exp: "12h",
    }),
  );

  app.group("/api", (app) => app.use(userController)).listen(3000);
  console.log("Server is running at http://localhost:3000");
  return app;
}

bootstrap();
