'use server'

import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/lucia'
import { db } from '@/db/database'
import { folder as folderTable } from '@/db/schema'

export const updateFolder = async (id: string, name: string) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        const existingFolder = await db.query.folder.findFirst({
            where: (folder, { and, eq }) =>
                and(eq(folder.name, name), eq(folder.userId, user.id)),
        })

        if (existingFolder) {
            return { error: 'Folder already exists', success: false }
        }

        await db
            .update(folderTable)
            .set({ name: name })
            .where(eq(folderTable.id, id))

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
