import type { CookieOptions, Request, Response } from "express";
import { env } from "../../env";
import { TRPCContext } from "../context";

// default max age
const ONE_MINUTE = 60 * 1000; // in millisecond
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 12 * ONE_MONTH;

const defaultCookieOptions: CookieOptions = {
  path: "/",
  httpOnly: true,
  secure: env.NODE_ENV === "prod" ? true : false,
  sameSite: "lax",
  maxAge: ONE_YEAR,
};

export function createCookieFactory(res: Response) {
  return function createCookie(
    name: string,
    value: string,
    options: CookieOptions = defaultCookieOptions,
  ) {
    res.cookie(name, value, options);
  };
}

export function getCookieFactory(req: Request) {
  return function getCookie(name: string) {
    return req.cookies?.[name] || req.headers.authorization?.split(" ")[1];
  };
}

export function clearCookieFactory(res: Response) {
  return function clearCookie(name: string) {
    return res.clearCookie(name);
  };
}

// authentication access token cookie
const AUTHENTICATION_COOKIE_NAME = "Authentication-Access-token";

export function setAuthenticationCookie(ctx: TRPCContext, accessToken: string) {
  return ctx.createCookie(AUTHENTICATION_COOKIE_NAME, accessToken);
}

export function getAuthenticationCookie(ctx: TRPCContext) {
  return ctx.getCookie(AUTHENTICATION_COOKIE_NAME);
}

export function clearAuthenticationCookie(ctx: TRPCContext) {
  return ctx.clearCookie(AUTHENTICATION_COOKIE_NAME);
}

//authentication refresh token cookie
const AUTHENTICATION_REFRESH_TOKEN_COOKIE_NAME = "Authentication-Refresh-token";

export function setAuthenticationRefreshTokenCookie(ctx: TRPCContext, refreshToken: string) {
  ctx.createCookie(AUTHENTICATION_REFRESH_TOKEN_COOKIE_NAME, refreshToken);
}

export function getAuthenticationRefreshCookie(ctx: TRPCContext) {
  return ctx.getCookie(AUTHENTICATION_REFRESH_TOKEN_COOKIE_NAME);
}

export function clearAuthenticationRefreshTokenCookie(ctx: TRPCContext) {
  ctx.clearCookie(AUTHENTICATION_REFRESH_TOKEN_COOKIE_NAME);
}
