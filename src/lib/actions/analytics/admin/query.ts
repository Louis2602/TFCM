"use server";

import { db } from "@/db/database";
import { getCurrentUser } from "@/lib/lucia";
import { eq, sql } from "drizzle-orm";
import { user as userTable, content, prompt } from "@/db/schema";

export async function getTotalUsers() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(userTable)
      .where(eq(userTable.role, "user"));

    const totalUsers = result[0].count;

    return {
      success: true,
      data: totalUsers,
      message: "Total user count fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}

export async function getPendingPosts() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(content)
      .where(eq(content.status, "pending"));

    const pendingPosts = result[0].count;

    return {
      success: true,
      data: pendingPosts,
      message: "Pending posts count fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}

export async function getTotalCost() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const result = await db
      .select({
        totalCost: sql<number>`CAST(SUM(${prompt.price}) * 0.0003 AS DECIMAL(10, 4))`,
      })
      .from(prompt);

    const totalCost = result[0].totalCost || 0;

    return {
      success: true,
      data: totalCost,
      message: "Total cost calculated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}

export async function getTotalPosts() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(content);

    const totalPosts = result[0].count;

    return {
      success: true,
      data: totalPosts,
      message: "Total posts count fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}
