import { Patterns, cron } from "@elysiajs/cron";
import type Elysia from "elysia";

export const setupCrons = (app: Elysia) => {
  app
    .use(
      cron({
        name: "cron1",
        pattern: Patterns.EVERY_10_HOURS,
        run() {
          console.log("Heartbeat1");
        },
      }),
    )
    .use(
      cron({
        name: "cron2",
        pattern: Patterns.EVERY_12_HOURS,
        run() {
          console.log("Heartbeat2");
        },
      }),
    );
};
