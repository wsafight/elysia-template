import { opentelemetry } from "@elysiajs/opentelemetry";
import { serverTiming } from "@elysiajs/server-timing";
import { swagger } from "@elysiajs/swagger";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import type { Elysia } from "elysia";

export const setupDevPlugins = (app: Elysia) => {
  app.use(swagger());
  app.use(serverTiming());
  // app.use(
  //   opentelemetry({
  //     spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
  //   })
  // );
};
