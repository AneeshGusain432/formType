import Jwt from "jsonwebtoken";
import { generateUserTokenPaylodType } from "../auth/model";
import { env } from "../env";
import crypto from "crypto";

export function generateAccessToken(payload: generateUserTokenPaylodType) {
  const token = Jwt.sign({ id: payload.id }, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY as "15m",
  });
  return { token };
}

export function generateRefreshToken(payload: generateUserTokenPaylodType) {
  const token = Jwt.sign({ id: payload.id }, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRY as "7d",
  });

  return { token };
}

// hash token
export async function hashToken(token: string) {
  return await crypto.createHash("sha256").update(token).digest("hex");
}


export async function verifyAccessTokentoken(token: string) {
  try {
    return Jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET) as generateUserTokenPaylodType
  } catch (error) {
    throw new Error("invalid or expired token")
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return Jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET) as generateUserTokenPaylodType;
  } catch {
    throw new Error("invalid or expired refresh token");
  }
}