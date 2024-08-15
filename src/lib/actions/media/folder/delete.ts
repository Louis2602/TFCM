'use server'

import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/lucia'
import { db } from '@/db/database'
import { folder as folderTable } from '@/db/schema'

export const removeFolder = async (id: string) => {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        await db.delete(folderTable).where(eq(folderTable.id, id))

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
