import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import { verifyAccessTokentoken } from "@repo/services/utils/jwtToken";

import { createContext } from "./context";
import { getAuthenticationCookie } from "./utils/cookie";

export const tRPCContext = initTRPC.meta<OpenApiMeta>().context<typeof createContext>().create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticatedProcedure = tRPCContext.procedure.use(async (options) => {
  const { ctx } = options;
  const token = getAuthenticationCookie(ctx);

  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "please login to continue" });
  }

  let id: string;
  try {
    ({ id } = await verifyAccessTokentoken(token));
  } catch {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "access token expired" });
  }

  return options.next({
    ctx: {
      ...ctx,
      user: { id },
    },
  });
});
