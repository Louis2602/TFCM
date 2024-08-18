"use server";

import { db } from "@/db/database";
import { getCurrentUser } from "@/lib/lucia";
import { eq } from "drizzle-orm";
import { user as userTable } from "@/db/schema";

export async function getAllUsers() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const allUsers = await db
      .select()
      .from(userTable)
      .where(eq(userTable.role, "user"));

    return {
      success: true,
      data: allUsers,
      message: "Users fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}
