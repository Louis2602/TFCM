"use server";

import { db } from "@/db/database";
import { getCurrentUser } from "@/lib/lucia";
import { sql } from "drizzle-orm";
import { prompt } from "@/db/schema";

export async function getMonthlyBudget() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const result = await db
      .select({
        month: sql<string>`TO_CHAR(${prompt.createdAt}, 'Mon')`,
        total: sql<number>`CAST(SUM(${prompt.price}) * 0.0003 AS DECIMAL(10, 2))`,
      })
      .from(prompt)
      .groupBy(sql`TO_CHAR(${prompt.createdAt}, 'Mon')`)
      .orderBy(sql`MIN(${prompt.createdAt})`);

    const monthlyBudget = result.map((item) => ({
      name: item.month,
      total: Number(item.total),
    }));

    return {
      success: true,
      data: monthlyBudget,
      message: "Monthly budget fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}
