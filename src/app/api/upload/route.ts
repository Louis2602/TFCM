import { db } from '@/db/database';
import { file as fileTable } from '@/db/schema';
import { env } from '@/env';
import { getCurrentUser } from '@/lib/lucia';
import { createId } from '@paralleldrive/cuid2';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
	const user = await getCurrentUser();

	if (!user) {
		return new Response('Not authorized.', {
			status: 401,
		});
	}

	if (!env.BLOB_READ_WRITE_TOKEN) {
		return new Response(
			"Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.",
			{
				status: 401,
			}
		);
	}

	const file = req.body || '';
	const filename = req.headers.get('x-vercel-filename') || 'file.txt';
	const contentType = req.headers.get('content-type') || 'text/plain';
	const fileType = `.${contentType.split('/')[1]}`;

	// construct final filename based on content-type if not provided
	const finalName = filename.includes(fileType)
		? filename
		: `${filename}${fileType}`;

	const blob = await put(finalName, file, {
		contentType,
		access: 'public',
	});

	const newFile = await db.insert(fileTable).values({
		id: createId(),
		userId: user.id,
		name: filename,
		url: blob.url,
		type: contentType,
	}).returning();

	return NextResponse.json(newFile[0]);
}
