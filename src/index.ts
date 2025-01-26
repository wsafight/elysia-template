import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { userController } from "./controllers/user";

async function bootstrap() {
  const app = new Elysia().use(swagger()).use(userController).listen(3000);

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}

bootstrap();
