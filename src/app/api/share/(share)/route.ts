import { NextResponse } from 'next/server';
import { db } from '@/db/database'; 
import { content } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from "@/lib/lucia";

export const runtime = 'edge';

export async function POST(req: Request, context: any) {
  const { contentId } = context.params;
  const currentUser = await getCurrentUser();
  
  try {
    // Fetch the content record by contentId
    const result = await db.select().from(content).where(eq(content.id, contentId)).limit(1);
    if (result.length === 0) {
      return new Response('Content not found', { status: 404 });
    }

    // Authorization check: Ensure currentUser matches the content's userId
    if (!currentUser || currentUser.id !== result[0].userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const updatedState = await db
      .update(content)
      .set({ state: 'public' })
      .where(eq(content.id, contentId))
      .returning({ updatedState: content.state });
    
    // Check if the update operation was successful based on the returned state
    if (updatedState[0]?.updatedState !== result[0].state) {
      return new Response('Content state updated successfully', { status: 200 });
    } else {
      return new Response('Failed to update content state', { status: 500 });
    }
  } catch (error) {
    return new Response(`Something went wrong: ${error}`, { status: 500 });
  }
}
