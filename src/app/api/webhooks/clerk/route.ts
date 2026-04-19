import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { syncUserWithClerk } from '@/lib/clerk';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || 'placeholder';

export async function POST(request: Request) {
  const payload = await request.json();
  const headerPayload = await headers();
  
  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id') || '',
    'svix-timestamp': headerPayload.get('svix-timestamp') || '',
    'svix-signature': headerPayload.get('svix-signature') || '',
  };

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(JSON.stringify(payload), svixHeaders) as WebhookEvent;
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      await syncUserWithClerk({
        id,
        emailAddresses: email_addresses.map((e: any) => ({ emailAddress: e.email_address })),
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      });

      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error syncing user:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
