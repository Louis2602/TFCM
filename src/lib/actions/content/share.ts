"use server";

import { db } from "@/db/database";
import { revalidatePath } from "next/cache";
import { content as contentTable } from "@/db/schema";
import { getCurrentUser } from "@/lib/lucia";
import { eq, and } from 'drizzle-orm';

export async function share(contentId: string) {
    try {
        if (!contentId) {
            return { success: false, message: 'Content ID must be provided' };
        }

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return { success: false, message: 'You must sign in to perform this action' };
        }

        const result = await db.select().from(contentTable).where(eq(contentTable.id, contentId)).limit(1);
        if (result.length === 0) {
            return { success: false, message: 'Content not found' };
        }

        if (currentUser.id !== result[0].userId) {
            return { success: false, message: 'Unauthorized' };
        }

        const updatedState = await db
            .update(contentTable)
            .set({ state: "public" })
            .where(eq(contentTable.id, contentId))
            .returning({ state: contentTable.state });

        if (updatedState[0]?.state === 'public') {
            revalidatePath(`/dashboard/archive`);
            return { success: true, message: 'Link sharing is available' };
        } else {
            return { success: false, message: 'Failed to update content state' };
        }
    } catch (error: any) {
        return { success: false, message: `Something went wrong: ${error.message}` };
    }
}

export async function getContentById(contentId: string) {
    try {
        const result = await db.select().from(contentTable).where(eq(contentTable.id, contentId)).limit(1);
        if (result.length === 0) {
            return { success: false, data: result, message: 'Content not found' };
        }

        if (result[0].state === 'private'){
            return { success: false, data: result, message: 'Unauthorized' };
        }


        return { success: true, data: result[0] };
    } catch (error: any) {
        return { success: false, message: `Something went wrong: ${error.message}` };
    }
}

export async function getAllSharedContents(){
    const currentUser = await getCurrentUser();

    try{
        if (!currentUser){
            return { success: false, message: 'You must login to continue'}
        }

        const result = await db.select().from(contentTable).where(and(eq(contentTable.userId, currentUser.id), eq(contentTable.state, 'public')));

        return { success: true, data: result, message: 'Content retrieve successfully'};
    } catch (error: any) {
        return { success: false, message: `Something went wrong: ${error.message}` };
    }
}

export async function unshare(contentId: string) {
    try {
        if (!contentId) {
            return { success: false, message: 'Content ID must be provided' };
        }

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return { success: false, message: 'You must sign in to perform this action' };
        }

        const result = await db.select().from(contentTable).where(and(eq(contentTable.id, contentId), (eq(contentTable.state, 'public')))).limit(1);
        if (result.length === 0) {
            return { success: false, message: 'Content not found' };
        }

        if (currentUser.id !== result[0].userId) {
            return { success: false, message: 'Unauthorized' };
        }

        const updatedState = await db
            .update(contentTable)
            .set({ state: "private" })
            .where(eq(contentTable.id, contentId))
            .returning({ state: contentTable.state });

        if (updatedState[0]?.state === 'private') {
            revalidatePath(`/dashboard/shared-links`);
            return { success: true, message: 'Unshare successfully' };
        } else {
            return { success: false, message: 'Failed to process' };
        }
    } catch (error: any) {
        return { success: false, message: `Something went wrong: ${error.message}` };
    }
}
