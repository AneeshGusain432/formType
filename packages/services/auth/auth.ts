import * as authModel from "./model";
import { OAuth2Client } from "google-auth-library";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import { hashUserPassword, compareUserPasswprd } from "../utils/hashpassword";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../utils/jwtToken";
import { env } from "../env";
import { resend } from "../utils/resend";
import { welcomeEmailTemplate } from "../utils/emailTemplate";

function issueTokens(userId: string) {
  const { token: accessToken } = generateAccessToken({ id: userId });
  const { token: refreshToken } = generateRefreshToken({ id: userId });
  return { accessToken, refreshToken };
}

// sanitize user
async function sanitizeUser(user: any) {
  const { password, ...sanitizeUser } = user;
  return sanitizeUser;
}

export async function SignupUserWithEmailAndPassword(
  payload: authModel.signUpUserWithEmailAndPasswordInputType,
) {
  const { fullName, email, password } =
    await authModel.signUpUserWithEmailAndPasswordInputModel.parseAsync(payload);

  // check user is already exist with this email
  const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (existingUser.length >= 1) {
    throw new Error(`user already exist with this email`);
  }

  // hash user password before creating user account
  const hashPassword = await hashUserPassword(password);

  // create user in db
  const user = await db
    .insert(usersTable)
    .values({ fullName, email, password: hashPassword })
    .returning();

  if (!user || user.length === 0) {
    throw new Error(`failed to create user account`);
  }

  if (existingUser.length <= 0) {
    try {
      await resend.emails.send({
        from: "FormType  <hello@aneeshgusain.space>",
        to: [user[0]?.email!],
        subject: "Welcome to FormType — let's build your first form",
        html: welcomeEmailTemplate,
        replyTo: "hello@aneeshgusain.space",
      });
    } catch (error: any) {
      throw new error();
    }
  }

  return user[0]!;
}

export async function signinWithEmailAndPassword(
  payload: authModel.signinUserWithEmailAndPasswordType,
) {
  const { email, password } =
    await authModel.signinUserwithEmailAndPasswordInput.parseAsync(payload);

  // find user in db
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (!user || user.length === 0) {
    throw new Error(`invalid email and password`);
  }

  // check password is valid or not
  const isPasswordValid = await compareUserPasswprd(password, user[0]?.password!);

  if (!isPasswordValid) {
    throw new Error(`invalid email and password`);
  }

  // generate token for user
  const { accessToken, refreshToken } = issueTokens(user[0]?.id!);
  const hashedRefreshToken = await hashToken(refreshToken);

  // save hash refresh token in db
  await db
    .update(usersTable)
    .set({ refreshToken: hashedRefreshToken })
    .where(eq(usersTable.id, user[0]?.id!));

  return { user: user[0]!, accessToken, refreshToken };
}

export async function signinWithGoogle(payload: authModel.signinWithGoogleInputType) {
  const { credential } = await authModel.signinWithGoogleInputModel.parseAsync(payload);

  if (!env.GOOGLE_CLIENT_ID) {
    throw new Error("Google OAuth is not configured");
  }

  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });
  const googleUser = ticket.getPayload();

  if (!googleUser?.sub || !googleUser.email || !googleUser.email_verified) {
    throw new Error("invalid Google account");
  }

  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, googleUser.email));

  const user = existingUser
    ? existingUser
    : (
        await db
          .insert(usersTable)
          .values({
            fullName: googleUser.name || googleUser.email.split("@")[0] || "Google user",
            email: googleUser.email,
            emailVerified: true,
            profileImageUrl: googleUser.picture,
          })
          .returning()
      )[0];

  if (!user) {
    throw new Error("failed to create Google account");
  }

  if (!existingUser) {
    try {
      await resend.emails.send({
        from: "FormType  <hello@aneeshgusain.space>",
        to: [user.email],
        subject: "Welcome to FormType — let's build your first form",
        html: welcomeEmailTemplate,
        replyTo: "hello@aneeshgusain.space",
      });
    } catch (error: any) {
      throw new error();
    }
  }

  const { accessToken, refreshToken } = issueTokens(user.id);
  await db
    .update(usersTable)
    .set({
      emailVerified: true,
      profileImageUrl: googleUser.picture || user.profileImageUrl,
      refreshToken: await hashToken(refreshToken),
    })
    .where(eq(usersTable.id, user.id));

  return { user, accessToken, refreshToken };
}

export async function getLoggedInUserInfo(userId: string) {
  const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));

  if (!user) {
    throw new Error("user does not exist");
  }

  return {
    user: user[0]!,
  };
}

export async function generateNewAccessToken(refreshToken: string) {
  const refreshTokenPayload = verifyRefreshToken(refreshToken);
  const refreshTokenHash = await hashToken(refreshToken);
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, refreshTokenPayload.id));

  if (!user || !user.refreshToken || user.refreshToken !== refreshTokenHash) {
    throw new Error("invalid refresh token");
  }

  const { token: accessToken } = generateAccessToken({ id: user.id });
  return { accessToken };
}

export async function logout(userId: string) {
  await db.update(usersTable).set({ refreshToken: null }).where(eq(usersTable.id, userId));

  return { success: true };
}
