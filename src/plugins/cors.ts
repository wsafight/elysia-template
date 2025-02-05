import cors from "@elysiajs/cors";
import type Elysia from "elysia";

export const setupCors = (app: Elysia) => {
  app.use(cors());
};
