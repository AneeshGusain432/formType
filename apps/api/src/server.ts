import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";
import cookieParser from 'cookie-parser'

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "FormType OpenAPI",
  version: "1.0.0",
  baseUrl: env.NEXT_PUBLIC_API_URL.concat("/api"),
});

if (env.NODE_ENV === "prod") {
  app.use(
    cors({
      origin: [env.NEXT_PUBLIC_API_CLIENT_URL || "http://localhost:3000"],
      credentials: true
    })
  );
}

app.use(cookieParser())

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "FormType is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "FormType server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.NEXT_PUBLIC_API_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.NEXT_PUBLIC_API_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
