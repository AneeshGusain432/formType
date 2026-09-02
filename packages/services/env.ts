import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  JWT_ACCESS_TOKEN_SECRET: z.string().describe("secret key for access tokens"),
  JWT_ACCESS_TOKEN_EXPIRY: z.string().describe("expiry for access tokens"),
  JWT_REFRESH_TOKEN_SECRET: z.string().describe("secret key for refresh tokens"),
  JWT_REFRESH_TOKEN_EXPIRY: z.string().describe("expiry for refresh tokens"),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);
  if (!safeParseResult.success) throw new Error(safeParseResult.error.message);
  return safeParseResult.data;
}

export const env = createEnv(process.env);
