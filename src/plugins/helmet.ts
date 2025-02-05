import type Elysia from "elysia";
import { helmet } from "elysia-helmet";

export const setupHelmet = (app: Elysia) => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          // current for swagger
          "script-src": ["'self'", "cdn.jsdelivr.net"],
        },
      },
    }),
  );
};
