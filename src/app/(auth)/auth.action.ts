"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/database";
import { user } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
  try {
    // if user already exists, throw an error
    const existingUser = await db.query.user.findFirst({
      where: (users, { eq }) => eq(users.email, values.email),
    });
    if (existingUser) {
      return { error: "User already exists", success: false };
    }

    const hashedPassword = await bcrypt.hash(values.password, 12);

    const [newUser] = await db
      .insert(user)
      .values({
        id: createId(),
        email: values.email.toLowerCase(),
        name: values.name,
        password: hashedPassword,
      })
      .returning({ id: user.id });
    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { success: true };
  } catch (error: any) {
    return { error: `Something went wrong: ${error.message}`, success: false };
  }
};

export const signIn = async (values: z.infer<typeof signInSchema>) => {
  const user = await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.email, values.email),
  });
  if (!user || !user.password) {
    return { success: false, error: "Invalid Credentials!" };
  }
  const passwordMatch = await bcrypt.compare(values.password, user.password);
  if (!passwordMatch) {
    return { success: false, error: "Invalid Credentials!" };
  }
  // successfully login
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return { success: true, isAdmin: user.role === "admin" };
};

export const signOut = async () => {
  const sessionCookie = await lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/sign-in");
};
