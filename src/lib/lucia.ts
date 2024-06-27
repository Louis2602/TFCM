import { cookies } from "next/headers";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "@/db/database";
import { env } from "@/env";
import { session as sessionTable, user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "tfcm-auth-cookie",
    expires: false,
    attributes: {
      secure: env.NODE_ENV === "production",
    },
  },
});

export const getCurrentUser = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value || null;
  if (!sessionId) {
    return null;
  }
  const { session, user } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      // refreshing their session cookie
      const sessionCookie = await lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!session) {
      const sessionCookie = await lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch (error) {}

  const [userDB] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, user.id!));

  return userDB;
};
