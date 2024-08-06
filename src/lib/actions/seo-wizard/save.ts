"use server";

import { db } from "@/db/database";
import { trending as trendingTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/lucia";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

export async function save(title: string, used: number, category: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    await db.insert(trendingTable).values({
      id: createId(),
      userId: user.id,
      title,
      used,
      category,
    });

    return {
      success: true,
      message: `Save trending successfully`,
    };
  } catch (error) {
    return { success: false, message: `Something went wrong: ${error}` };
  }
}

export async function update(title: string, used: number, category: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    await db
      .update(trendingTable)
      .set({ used: used, category: category })
      .where(eq(trendingTable.title, title))
      .returning({
        used: trendingTable.used,
        category: trendingTable.category,
      });

    return {
      success: true,
      message: `Save trending successfully`,
    };
  } catch (error) {
    return { success: false, message: `Something went wrong: ${error}` };
  }
}
