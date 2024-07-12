import { NextResponse } from 'next/server';
import { db } from '@/db/database'; 
import { content } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from "@/lib/lucia";

export const runtime = 'edge';

export async function GET(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Query to get all content where state is public and userId matches current user
    const results = await db.select().from(content)
      .where(and(eq(content.userId, currentUser.id), eq(content.state, 'public')));

    return NextResponse.json(results);
  } catch (error) {
    return new Response(`Something went wrong: ${error}`, { status: 500 });
  }
}
