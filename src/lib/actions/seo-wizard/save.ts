"use server";

import { db } from "@/db/database";
import { trending as trendingTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/lucia";
import { createId } from "@paralleldrive/cuid2";

export async function save(title: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    await db.insert(trendingTable).values({
      id: createId(),
      userId: user.id,
      title,
    });

    return {
      success: true,
      message: `Save trending successfully`,
    };
  } catch (error) {
    return { success: false, message: `Something went wrong: ${error}` };
  }
}
