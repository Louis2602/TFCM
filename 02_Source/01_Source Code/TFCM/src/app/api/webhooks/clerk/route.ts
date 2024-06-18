import { Webhook, WebhookVerificationError } from 'svix';
import { headers } from 'next/headers';
import { eq, DrizzleError } from 'drizzle-orm';
import { db } from '@/db/database';
import { account, user } from '@/db/schema';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createId } from '@paralleldrive/cuid2';
import { env } from '@/env';

export async function POST(req: Request) {
	try {
		// You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
		const WEBHOOK_SECRET = env.WEBHOOK_SECRET;

		if (!WEBHOOK_SECRET) {
			throw new Error(
				'Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local'
			);
		}

		// Get the headers
		const headerPayload = headers();
		const svix_id = headerPayload.get('svix-id');
		const svix_timestamp = headerPayload.get('svix-timestamp');
		const svix_signature = headerPayload.get('svix-signature');

		// If there are no headers, error out
		if (!svix_id || !svix_timestamp || !svix_signature) {
			return new Response('Error occured -- no svix headers', {
				status: 400,
			});
		}
		// Get the body
		const payload = await req.json();
		const body = JSON.stringify(payload);

		const wh = new Webhook(WEBHOOK_SECRET);

		let evt: WebhookEvent;

		// Verify the payload with the headers
		try {
			evt = wh.verify(body, {
				'svix-id': svix_id,
				'svix-timestamp': svix_timestamp,
				'svix-signature': svix_signature,
			}) as WebhookEvent;
		} catch (err) {
			console.error('Error verifying webhook:', err);
			return new Response('Error occured', {
				status: 400,
			});
		}

		if (evt.type === 'user.created') {
			const { id, ...attributes } = evt.data;

			await db.transaction(async (tx) => {
				await tx
					.insert(account)
					.values({ id: createId(), userId: id, attributes });

				const [accountDB] = await tx
					.select()
					.from(account)
					.where(eq(account.userId, id))
					.limit(1);

				await tx.insert(user).values({
					id,
					accountId: accountDB.id,
					email: attributes.email_addresses[0].email_address,
					firstName: attributes.first_name,
					lastName: attributes.last_name,
					imageUrl: attributes.image_url,
					credits: 30,
				});
			});
		}

		return new Response(null, { status: 200 });
	} catch (error) {
		if (error instanceof WebhookVerificationError) {
			return new Response(error.message, { status: 400 });
		}

		if (error instanceof DrizzleError) {
			return new Response(error.message, { status: 400 });
		}
		return new Response(`Something went wrong: ${error}`, {
			status: 500,
		});
	}
}
