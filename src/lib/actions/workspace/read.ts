'use server'

import { getCurrentUser } from '@/lib/lucia'
import { db } from '@/db/database'
import { content as contentDB, user as userDB } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export const getContent = async (
    offset: number,
    size: number,
) => {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        let contentsDB = await db.select({
            id: contentDB.id,
            title: contentDB.title,
            status: contentDB.status,
            reviewedBy: userDB.name,
            reviewComment: contentDB.reviewComment,
        })
            .from(contentDB)
            .where(eq(contentDB.userId, user.id))
            .orderBy(desc(contentDB.reviewedAt))
            .leftJoin(userDB, eq(userDB.id, contentDB.reviewedBy))

        const contents = contentsDB.slice(offset, offset + size)

        return { success: true, contents: contents, size: contentsDB.length }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
