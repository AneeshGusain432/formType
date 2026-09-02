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

const allowedOrigins = [
  env.NEXT_PUBLIC_API_CLIENT_URL,
  env.API_CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://localhost:3000",
  "https://127.0.0.1:3000",
].filter((value): value is string => Boolean(value));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      const isLocalhostOrigin =
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.startsWith("https://localhost:") ||
        origin.startsWith("https://127.0.0.1:");

      if (isLocalhostOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

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
