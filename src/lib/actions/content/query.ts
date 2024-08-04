"use server";

import { db } from "@/db/database";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/lucia";
import { content } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserDocuments() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const userDocuments = await db
      .select()
      .from(content)
      .where(eq(content.userId, user.id));

    revalidatePath("/dashboard/archive");

    return {
      success: true,
      data: userDocuments,
      message: `Content fetched successfully`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}

export async function getContentById(id: string) {
  try {
    if (!id) {
      throw new Error("Content ID is required");
    }

    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const document = await db.query.content.findFirst({
      where: (contents, { eq }) => eq(contents.id, id),
    });

    if (!document) {
      return {
        success: false,
        message: `Content with ID ${id} not found`,
      };
    }
    return {
      success: true,
      data: document,
      message: "Content fetched successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}

export async function getAllContent() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const userDocuments = await db.select().from(content);

    return {
      success: true,
      data: userDocuments,
      message: `Content fetched successfully`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Something went wrong: ${error.message}`,
    };
  }
}
