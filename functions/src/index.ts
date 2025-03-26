/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import * as functions from 'firebase-functions';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Firebase Admin SDKの初期化
admin.initializeApp();

// Stripeの初期化
const stripeClient = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-10-16',
});

interface DesignData {
  prompt: string;
  style: string;
}

interface CheckoutData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

interface GetDesignData {
  designId: string;
}

interface UpdateCreditsData {
  amount: number;
}

// デザイン関連の関数
export const createDesign = onCall<DesignData>({
  region: 'asia-northeast1',
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', '認証が必要です');
  }

  try {
    const { prompt, style } = request.data;
    const userId = request.auth.uid;
    const designRef = admin.firestore().collection('designs').doc();
    
    await designRef.set({
      userId,
      prompt,
      style,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    });

    return { id: designRef.id };
  } catch (error) {
    throw new HttpsError('internal', 'デザインの作成に失敗しました');
  }
});

export const getDesign = onCall<GetDesignData>({
  region: 'asia-northeast1',
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', '認証が必要です');
  }

  try {
    const { designId } = request.data;
    const designDoc = await admin.firestore().collection('designs').doc(designId).get();
    
    if (!designDoc.exists) {
      throw new HttpsError('not-found', 'デザインが見つかりません');
    }

    return designDoc.data();
  } catch (error) {
    throw new HttpsError('internal', 'デザインの取得に失敗しました');
  }
});

// Stripe関連の関数
export const createCheckoutSession = onCall<CheckoutData>({
  region: 'asia-northeast1',
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', '認証が必要です');
  }

  try {
    const { priceId, successUrl, cancelUrl } = request.data;
    const userId = request.auth.uid;

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
    });

    return { sessionId: session.id };
  } catch (error) {
    throw new HttpsError('internal', 'チェックアウトセッションの作成に失敗しました');
  }
});

export const stripeWebhook = onRequest({
  region: 'asia-northeast1',
}, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe.webhook_secret;

  if (!sig || !endpointSecret) {
    res.status(400).send('Missing stripe-signature or webhook secret');
    return;
  }

  try {
    const event = stripeClient.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        
        if (userId) {
          // ユーザーのクレジットを更新
          await admin.firestore().collection('users').doc(userId).update({
            credits: admin.firestore.FieldValue.increment(100) // 仮の値
          });
        }
        break;
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// 認証関連の関数
export const updateUserCredits = onCall<UpdateCreditsData>({
  region: 'asia-northeast1',
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', '認証が必要です');
  }

  try {
    const { amount } = request.data;
    const userId = request.auth.uid;
    
    await admin.firestore().collection('users').doc(userId).update({
      credits: admin.firestore.FieldValue.increment(amount)
    });

    return { success: true };
  } catch (error) {
    throw new HttpsError('internal', 'クレジットの更新に失敗しました');
  }
});
