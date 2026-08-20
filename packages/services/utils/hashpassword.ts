import bcrypt from "bcryptjs";

export async function hashUserPassword(password: string) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword
}

export async function compareUserPasswprd(inputPassword: string, storedPassword: string) {
  return await bcrypt.compare(inputPassword, storedPassword);
}
