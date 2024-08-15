'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/db/database'
import { file } from '@/db/schema'
import { getCurrentUser } from '@/lib/lucia'

export const renameFile = async (contentId: string, newName: string) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        const existingFile = await db.query.file.findFirst({
            where: (file, { and, eq }) =>
                and(eq(file.name, newName), eq(file.userId, user.id)),
        })

        if (existingFile) {
            return { error: 'Content name is already used', success: false }
        }

        await db
            .update(file)
            .set({ name: newName })
            .where(eq(file.id, contentId))

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
