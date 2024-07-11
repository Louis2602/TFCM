import { NextResponse } from 'next/server';
import { db } from '@/db/database'; 
import { content } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from "@/lib/lucia";

export const runtime = 'edge';

export async function GET(req : Request, context : any) {
  const { contentId } = context.params;
  try {
    const result = await db.select().from(content).where(eq(content.id, contentId)).limit(1);
    if (result.length === 0) {
      return new Response('Content not found', { status: 404 });
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching content:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
