'use server'

import { getCurrentUser } from '@/lib/lucia'
import { db } from '@/db/database'
import { ContentSearchFilter } from '@/types/archive'

export const getContent = async (
    offset: number,
    size: number,
    filter?: ContentSearchFilter
) => {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        let contentsDB = await db.query.content.findMany({
            where: (content, { eq }) => eq(content.userId, user.id),
            orderBy: (content, { desc }) => [desc(content.updatedAt)],
        })

        if (filter?.category) {
            contentsDB = contentsDB.filter(
                (content) => content.categoryId === filter.category
            )
        }

        const contents = contentsDB
            .slice(offset, offset + size)

        return { success: true, contents: contents, size: contentsDB.length }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
