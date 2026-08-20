import { z } from "zod";

export const signUpUserWithEmailAndPasswordInputModel = z.object({
  fullName: z.string().describe("full name of the user"),
  email: z.email().describe("email address of the user"),
  password: z.string().describe("password of the user"),
});

export const signinUserwithEmailAndPasswordInput = z.object({
  email: z.email().describe("email address of the user"),
  password: z.string().describe("password of the user"),
});

export const signinWithGoogleInputModel = z.object({
  credential: z.string().min(1).describe("Google ID token credential"),
});

export const generateUserTokenPaylodModel = z.object({
  id: z.string().describe("uuid of the user"),
});

export type signinUserWithEmailAndPasswordType = z.infer<
  typeof signinUserwithEmailAndPasswordInput
>;

export type signUpUserWithEmailAndPasswordInputType = z.infer<
  typeof signUpUserWithEmailAndPasswordInputModel
>;

export type generateUserTokenPaylodType = z.infer<typeof generateUserTokenPaylodModel>;
export type signinWithGoogleInputType = z.infer<typeof signinWithGoogleInputModel>;
