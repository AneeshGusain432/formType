import { z } from "zod";

const userOutputModel = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  emailVerified: z.boolean().nullable(),
  profileImageUrl: z.string().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const createUserWithEmailAndPasswordInputTrpcModel = z.object({
  fullName: z.string().describe("full name of the user"),
  email: z.email().describe("email address of the user"),
  password: z.string().describe("password of the user"),
});

export const createUserWithEmailAndPasswordOutputTrpcModel = z.object({
  user: userOutputModel,
});

export const signinUserWithEmailAndPasswordInputTrpcModel = z.object({
  email: z.email().describe("email address of the user"),
  password: z.string().describe("password of the user"),
});

export const signinUserWithEmailAndPasswordOutputTrpcModel = z.object({
  user: userOutputModel,
  accessToken: z.string().describe("access token of user"),
  refreshToken: z.string().describe("refreshToken of user"),
});

export const signinWithGoogleInputTrpcModel = z.object({
  credential: z.string().min(1).describe("Google ID token credential"),
});

export const signinWithGoogleOutputTrpcModel = signinUserWithEmailAndPasswordOutputTrpcModel;

export const generateNewAccessTokenInputTrpcModel = z.object({});

export const generateNewAccessTokenOutputTrpcModel = z.object({
  accessToken: z.string().describe("new access token of user"),
});

export const logoutInputTrpcModel = z.object({});

export const logoutOutputTrpcModel = z.object({
  success: z.boolean(),
});

export const getLoggedInUserInfoInputTrpcModel = z.undefined();

export const getLoggedInUserInfoOutputTrpcModel = z.object({
  user: userOutputModel,
});
