"use server";

import { db } from "@/db/database";
import { getCurrentUser } from "@/lib/lucia";
import { sql } from "drizzle-orm";
import { content } from "@/db/schema";

export async function getMonthlyPostProgress() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const result = await db
      .select({
        month: sql<string>`TO_CHAR(${content.createdAt}, 'Mon')`,
        total: sql<number>`count(*)`,
      })
      .from(content)
      .groupBy(sql`TO_CHAR(${content.createdAt}, 'Mon')`)
      .orderBy(sql`MIN(${content.createdAt})`);

    const monthlyBudget = result.map((item) => ({
      name: item.month,
      total: Number(item.total),
    }));

    return {
      success: true,
      data: monthlyBudget,
      message: "Monthly posts fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}
