/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// v1 の import に変更
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Firebase Admin SDKの初期化
admin.initializeApp();

// Stripeの初期化
// デプロイ時に設定が存在しない場合のためのフォールバック値を設定
const stripeSecretKey = functions.config().stripe?.secret_key || 'sk_test_dummy_key';
const stripeClient = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

// デザイン関連の関数
export const createDesign = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
  }

  try {
    const { prompt, style } = data;
    const userId = context.auth.uid;
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
    throw new functions.https.HttpsError('internal', 'デザインの作成に失敗しました');
  }
});

export const getDesign = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
  }

  try {
    const { designId } = data;
    const designDoc = await admin.firestore().collection('designs').doc(designId).get();
    
    if (!designDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'デザインが見つかりません');
    }

    return designDoc.data();
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'デザインの取得に失敗しました');
  }
});

// Stripe関連の関数
export const createCheckoutSession = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
  }

  try {
    const { priceId, successUrl, cancelUrl } = data;
    const userId = context.auth.uid;

    // Stripe設定が存在しない場合はエラーを返す
    if (stripeSecretKey === 'sk_test_dummy_key') {
      throw new functions.https.HttpsError('failed-precondition', 'Stripe設定が構成されていません');
    }

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
    throw new functions.https.HttpsError('internal', 'チェックアウトセッションの作成に失敗しました');
  }
});

export const stripeWebhook = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = functions.config().stripe?.webhook_secret || '';

  if (!sig) {
    res.status(400).send('Missing stripe-signature');
    return;
  }

  // webhook_secretが設定されていない場合は早期リターン
  if (!endpointSecret) {
    console.warn('Webhook secret is not configured');
    res.status(200).send('Webhook received but secret is not configured');
    return;
  }

  try {
    const event = stripeClient.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
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
export const updateUserCredits = functions.region('asia-northeast1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
  }

  try {
    const { amount } = data;
    const userId = context.auth.uid;
    
    await admin.firestore().collection('users').doc(userId).update({
      credits: admin.firestore.FieldValue.increment(amount)
    });

    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'クレジットの更新に失敗しました');
  }
});
