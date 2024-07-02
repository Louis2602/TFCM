"use server";

import { db } from "@/db/database";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { updateProfileSchema } from "../validations/profile";
import { z } from "zod";
import { getCurrentUser } from "../lucia";
import { del } from "@vercel/blob";

export async function updateUserProfile(
  formData: z.infer<typeof updateProfileSchema>,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const data = updateProfileSchema.parse(formData);

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    if (user.picture) {
      await del(user.picture);
    }

    await db.update(userTable).set(updateData).where(eq(userTable.id, user.id));

    revalidatePath(`/dashboard/settings`);

    return { success: true, message: `Update profile successfully` };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: JSON.stringify(error.issues) };
    }

    return { success: false, message: `Something went wrong: ${error}` };
  }
}
