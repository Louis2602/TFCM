"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/database";
import { content as contentTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/lucia";

export const renameContent = async (contentId: string, newName: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "Not Authorized", success: false };
    }

    const existingContent = await db.query.content.findFirst({
      where: (content, { and, eq }) =>
        and(eq(content.title, newName), eq(content.userId, user.id)),
    });

    if (existingContent) {
      return { error: "Content name is already used", success: false };
    }

    await db
      .update(contentTable)
      .set({ title: newName })
      .where(eq(contentTable.id, contentId));

    return { success: true };
  } catch (error: any) {
    return {
      error: `Something went wrong: ${error.message}`,
      success: false,
    };
  }
};
