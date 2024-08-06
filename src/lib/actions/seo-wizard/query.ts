"use server";

import { db } from "@/db/database";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/lucia";
import { trending } from "@/db/schema";
import { eq, ilike, and, not } from "drizzle-orm";

export async function getUserTrendingTags() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const userTrendingTags = await db
      .select()
      .from(trending)
      .where(and(eq(trending.userId, user.id), ilike(trending.title, "#%")));

    revalidatePath("/dashboard/archive");

    return {
      success: true,
      data: userTrendingTags,
      message: `Content fetched successfully`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}

export async function getUserTrendingKeywords() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const userTrendingKeywords = await db
      .select()
      .from(trending)
      .where(
        and(eq(trending.userId, user.id), not(ilike(trending.title, "#%")))
      );

    revalidatePath("/dashboard/archive");

    return {
      success: true,
      data: userTrendingKeywords,
      message: `Content fetched successfully`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}
