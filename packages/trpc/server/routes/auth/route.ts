import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import {
  clearAuthenticationCookie,
  clearAuthenticationRefreshTokenCookie,
  getAuthenticationRefreshCookie,
  setAuthenticationCookie,
  setAuthenticationRefreshTokenCookie,
} from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputTrpcModel,
  createUserWithEmailAndPasswordOutputTrpcModel,
  getLoggedInUserInfoInputTrpcModel,
  getLoggedInUserInfoOutputTrpcModel,
  signinUserWithEmailAndPasswordInputTrpcModel,
  signinUserWithEmailAndPasswordOutputTrpcModel,
  signinWithGoogleInputTrpcModel,
  signinWithGoogleOutputTrpcModel,
  generateNewAccessTokenInputTrpcModel,
  generateNewAccessTokenOutputTrpcModel,
  logoutInputTrpcModel,
  logoutOutputTrpcModel,
} from "./model";
import * as userService from "@repo/services/auth/auth";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  // signup Procedure
  signupUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/signupUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(createUserWithEmailAndPasswordInputTrpcModel)
    .output(createUserWithEmailAndPasswordOutputTrpcModel)
    .mutation(async ({ input }) => {
      const { fullName, email, password } = input;
      const user = await userService.SignupUserWithEmailAndPassword({ fullName, email, password });

      return { user };
    }),

  // signin Procedure
  signinUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/signinUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(signinUserWithEmailAndPasswordInputTrpcModel)
    .output(signinUserWithEmailAndPasswordOutputTrpcModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { user, accessToken, refreshToken } = await userService.signinWithEmailAndPassword({
        email,
        password,
      });

      // set accessToken in cookies
      setAuthenticationCookie(ctx, accessToken);

      // set refreshToken in cookie
      setAuthenticationRefreshTokenCookie(ctx, refreshToken);

      return {
        user,
        accessToken,
        refreshToken,
      };
    }),

  signinWithGoogle: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/signinWithGoogle"),
        tags: TAGS,
      },
    })
    .input(signinWithGoogleInputTrpcModel)
    .output(signinWithGoogleOutputTrpcModel)
    .mutation(async ({ input, ctx }) => {
      const { user, accessToken, refreshToken } = await userService.signinWithGoogle(input);
      setAuthenticationCookie(ctx, accessToken);
      setAuthenticationRefreshTokenCookie(ctx, refreshToken);
      return { user, accessToken, refreshToken };
    }),

  generateNewAccessToken: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/generateNewAccessToken"),
        tags: TAGS,
      },
    })
    .input(generateNewAccessTokenInputTrpcModel)
    .output(generateNewAccessTokenOutputTrpcModel)
    .mutation(async ({ ctx }) => {
      const refreshToken = getAuthenticationRefreshCookie(ctx);

      if (!refreshToken) {
        throw new Error("refresh token is required");
      }

      const result = await userService.generateNewAccessToken(refreshToken);
      setAuthenticationCookie(ctx, result.accessToken);

      return result;
    }),

  logout: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/logout"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(logoutInputTrpcModel)
    .output(logoutOutputTrpcModel)
    .mutation(async ({ ctx }) => {
      const result = await userService.logout(ctx.user.id);
      clearAuthenticationCookie(ctx);
      clearAuthenticationRefreshTokenCookie(ctx);

      return result;
    }),

  // get user info Procedure
  getLoggedInUserInfo: authenticatedProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/getLoggedInUserInfo"), tags: TAGS, protect: true },
    })
    .input(getLoggedInUserInfoInputTrpcModel)
    .output(getLoggedInUserInfoOutputTrpcModel)
    .query(async ({ ctx }) => {
      const { user } = await userService.getLoggedInUserInfo(ctx.user.id);
      return { user };
    }),
});
