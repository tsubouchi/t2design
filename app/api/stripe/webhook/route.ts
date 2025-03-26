import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { realtimeDb } from '@/lib/firebase';
import { ref, set } from 'firebase/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const priceId = session.line_items?.data[0]?.price?.id;

        if (!userId || !priceId) {
          throw new Error('Missing required data');
        }

        // クレジットを追加
        const credits = getCreditsForPrice(priceId);
        const userRef = ref(realtimeDb, `users/${userId}/credits`);
        await set(userRef, credits);

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata.userId;

        if (!userId) {
          throw new Error('Missing userId in subscription metadata');
        }

        // サブスクリプション情報を更新
        const subscriptionRef = ref(realtimeDb, `users/${userId}/subscription`);
        await set(subscriptionRef, {
          status: subscription.status,
          plan: subscription.items.data[0]?.price?.id,
          currentPeriodEnd: subscription.current_period_end,
        });

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

function getCreditsForPrice(priceId: string): number {
  const creditPrices = {
    [process.env.NEXT_PUBLIC_STRIPE_CREDIT_100_PRICE_ID!]: 100,
    [process.env.NEXT_PUBLIC_STRIPE_CREDIT_500_PRICE_ID!]: 500,
    [process.env.NEXT_PUBLIC_STRIPE_CREDIT_1000_PRICE_ID!]: 1000,
    [process.env.NEXT_PUBLIC_STRIPE_CREDIT_3000_PRICE_ID!]: 3000,
  };

  return creditPrices[priceId as keyof typeof creditPrices] || 0;
} 