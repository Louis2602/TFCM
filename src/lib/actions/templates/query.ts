"use server";

import { db } from "@/db/database";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/lucia";
import { template } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserTemplates() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const userTemplates = await db
      .select()
      .from(template)
      .where(eq(template.userId, user.id));

    revalidatePath("/dashboard/archive");

    return {
      success: true,
      data: userTemplates,
      message: `Content fetched successfully`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}

