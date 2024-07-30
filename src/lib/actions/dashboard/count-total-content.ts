'use server';
import { db } from "@/db/database";
import { content as contentTable } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/lucia";

export default async function countTotalContent() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return { success: false, message: 'You must sign in to perform this action' };
        }

        const result = await db
            .select({
                postCount: count(contentTable.id)
            })
            .from(contentTable)
            .where(eq(contentTable.userId, currentUser.id));

        return { success: true, data: result[0].postCount };
    } catch (e: any) {
        return { success: false, message: e.message || e.toString() };
    }
}
