"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/database";
import { content as contentTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/lucia";
import { revalidatePath } from "next/cache";
import { ReviewStatus } from "@/types/db";

export const updateContentStatus = async (
  status: ReviewStatus,
  contentId: string,
  comment: string,
) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized!");
    }

    const existingContent = await db.query.content.findFirst({
      where: (content, { eq }) => eq(content.id, contentId),
    });

    if (!existingContent) {
      throw new Error("Content not found");
    }

    await db
      .update(contentTable)
      .set({
        status: status,
        reviewComment: comment,
        reviewedAt: new Date(),
        reviewedBy: user.id,
      })
      .where(eq(contentTable.id, contentId));

    revalidatePath(`/admin/dashboard/posts`);

    return {
      success: true,
      message: `Update content status successfully`,
    };
  } catch (error: any) {
    return {
      error: `Something went wrong: ${error.message}`,
      success: false,
    };
  }
};

export const deleteContent = async (contentId: string) => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized!");
    }

    const existingContent = await db.query.content.findFirst({
      where: (content, { eq }) => eq(content.id, contentId),
    });

    if (!existingContent) {
      throw new Error("Content not found");
    }

    await db.delete(contentTable).where(eq(contentTable.id, contentId));
    revalidatePath(`/admin/dashboard/posts`);

    return {
      success: true,
      message: `Content deleted successfully`,
    };
  } catch (error: any) {
    return {
      error: `Something went wrong: ${error.message}`,
      success: false,
    };
  }
};
