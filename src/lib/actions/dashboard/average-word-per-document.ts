'use server';

import { content as contentTable } from '@/db/schema';
import { db } from '@/db/database';
import { eq, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/lucia';

export interface AverageWordsPerDocument {
    averageWordCount: number;
}

export default async function averageWordsPerDocument(): Promise<{ success: boolean, data?: AverageWordsPerDocument, message?: string }> {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return { success: false, message: 'You must sign in to perform this action' };
        }

        // Calculate the average number of words per document
        const result = await db
            .select({
                averageWordCount: sql`AVG(LENGTH(${contentTable.body}) - LENGTH(REPLACE(${contentTable.body}, ' ', '')) + 1)`.as('averageWordCount')
            })
            .from(contentTable)
            .where(eq(contentTable.userId, currentUser.id))
            .then(res => res[0]?.averageWordCount as number);

        if (result === undefined || result === null) {
            return { success: false, message: 'No data available to calculate average word count' };
        }

        return { success: true, data: { averageWordCount: result } };
    } catch (e: any) {
        return { success: false, message: e.message || e.toString() };
    }
}
