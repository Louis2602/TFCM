import { NextResponse } from 'next/server';
import { db } from '@/db/database'; 
import { content } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from "@/lib/lucia";

export const runtime = 'edge';

export async function GET(req: Request, context: any) {
  const { contentId } = context.params;
  const currentUser = await getCurrentUser();
  
  try {
    const result = await db.select().from(content).where(eq(content.id, contentId)).limit(1);
    if (result.length === 0) {
      return new Response('Content not found', { status: 404 });
    }

    // Handle state of the content
    if(result[0].state == "private"){
      if (!currentUser || result[0].userId != currentUser.id){
        return new Response('Unauthorized', { status: 401 });
      }
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    return new Response(`Something went wrong: ${error}`, { status: 500 });
  }
}
