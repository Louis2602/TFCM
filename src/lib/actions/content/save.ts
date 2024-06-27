"use server";

import { db } from "@/db/database";
import { revalidatePath } from "next/cache";
import { content as contentTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/lucia";
import { createId } from "@paralleldrive/cuid2";

export async function save(body: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    await db.insert(contentTable).values({
      id: createId(),
      userId: user.id,
      body,
    });

    revalidatePath(`/content-writer`);

    return {
      success: true,
      message: `Save content successfully`,
    };
  } catch (error) {
    return { success: false, message: `Something went wrong: ${error}` };
  }
}
