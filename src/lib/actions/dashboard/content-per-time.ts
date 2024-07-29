'use server';
import { content as contentTable } from '@/db/schema';
import { db } from '@/db/database';
import { eq, count, sql, between, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/lucia';
import { format, addMonths, eachDayOfInterval, eachMonthOfInterval, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

export interface PostCountPerDay {
    date: string; // Use string for date
    postCount: number;
}

export default async function countContentPerTime(startDate: Date, endDate: Date) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return { success: false, message: 'You must sign in to perform this action' };
        }

        const isMoreThan90Days = Math.abs(endDate.getTime() - startDate.getTime()) > 90 * 24 * 60 * 60 * 1000;

        let result: { date: string; postCount: number }[];

        if (isMoreThan90Days) {
            // Group by month
            result = await db
                .select({
                    date: sql`DATE_TRUNC('month', ${contentTable.createdAt})::DATE AS date`, // Format as DATE
                    postCount: count(contentTable.id)
                })
                .from(contentTable)
                .where(
                    and(
                        eq(contentTable.userId, currentUser.id),
                        between(
                            contentTable.createdAt,
                            startOfMonth(startDate),
                            endOfMonth(endDate)
                        )
                    )
                )
                .groupBy(sql`DATE_TRUNC('month', ${contentTable.createdAt})`)
                .then(res => res as { date: string; postCount: number }[]); // Explicitly cast result
        } else {
            // Group by day
            result = await db
                .select({
                    date: sql`DATE(${contentTable.createdAt}) AS date`, // Format as DATE
                    postCount: count(contentTable.id)
                })
                .from(contentTable)
                .where(
                    and(
                        eq(contentTable.userId, currentUser.id),
                        between(contentTable.createdAt, startDate, endDate)
                    )
                )
                .groupBy(sql`DATE(${contentTable.createdAt})`)
                .then(res => res as { date: string; postCount: number }[]);
        }

        // Generate a range of dates to ensure all dates are present
        const allDates = isMoreThan90Days
            ? eachMonthOfInterval({ start: startOfMonth(startDate), end: endOfMonth(endDate) })
            : eachDayOfInterval({ start: startOfDay(startDate), end: endOfDay(endDate) });

        const dateMap = new Map<string, number>();

        allDates.forEach(date => {
            dateMap.set(format(date, 'yyyy-MM-dd'), 0);
        });

        result.forEach(row => {
            dateMap.set(row.date, row.postCount);
        });

        const formattedResult: PostCountPerDay[] = Array.from(dateMap.entries()).map(([date, postCount]) => ({
            date,
            postCount
        }));

        return { success: true, data: formattedResult };
    } catch (e: any) {
        return { success: false, message: e.message || e.toString() };
    }
}
