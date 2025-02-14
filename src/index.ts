import { Elysia } from "elysia";
import { setupControllers } from "./controllers";
import { setupCrons } from "./crons";
import { setupDevPlugins } from "./devPlugins";
import { setupCors, setupHelmet, setupJwt } from "./plugins";

const bootstrap = () => {
  const app = new Elysia();

  setupDevPlugins(app);

  app.get("/health", () => "ok");

  // 安全防护
  setupHelmet(app);

  // 配置跨域
  setupCors(app);

  // JWT 验证
  setupJwt(app);

  // 路由请求
  setupControllers(app);

  // 定时任务
  setupCrons(app);

  app.listen(3000);
  console.log("Server is running at http://localhost:3000");
  return app;
};

bootstrap();
