'use server'

import { getCurrentUser } from '@/lib/lucia'
import { db } from '@/db/database'
import { content as contentDB } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const updateContentStatus = async (
    contentId: string
) => {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        // Update the status to "pending"
        const result = await db
            .update(contentDB)
            .set({ status: 'pending' })
            .where(eq(contentId, contentDB.id))
            .returning()

        if (result.length === 0) {
            return { error: 'Content not found', success: false }
        }

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
