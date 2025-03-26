const admin = require('firebase-admin');
const functions = require('./lib/index.js');

// Firebaseの初期化は行わない（index.jsですでに行われている）
// admin.initializeApp() の行を削除

// モックリクエストの作成
function createMockRequest(auth, data) {
  return {
    auth,
    data
  };
}

// テスト用のレスポンスオブジェクト
function createMockResponse() {
  return {
    status: function(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    send: function(data) {
      this.data = data;
      return this;
    },
    json: function(data) {
      this.data = data;
      return this;
    }
  };
}

// テスト実行関数
async function runTests() {
  console.log('===== Firebase Functions テスト開始 =====');
  
  // テスト用ユーザーID
  const testUserId = 'test-user-' + Date.now();
  
  // テストユーザーをFirestoreに作成
  await setupTestUser(testUserId);
  
  // 認証情報のモック
  const mockAuth = { uid: testUserId };
  
  try {
    // 1. createDesign のテスト
    const designId = await testCreateDesign(mockAuth);
    
    // 2. getDesign のテスト
    await testGetDesign(mockAuth, designId);
    
    // 3. createCheckoutSession のテスト
    await testCreateCheckoutSession(mockAuth);
    
    // 4. stripeWebhook のテスト
    await testStripeWebhook();
    
    // 5. updateUserCredits のテスト
    await testUpdateUserCredits(mockAuth);
    
    console.log('===== すべてのテスト完了 =====');
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
  } finally {
    // テストデータをクリーンアップ
    await cleanupTestData(testUserId);
  }
}

// テストユーザーのセットアップ
async function setupTestUser(userId) {
  console.log(`テストユーザー(${userId})を作成中...`);
  await admin.firestore().collection('users').doc(userId).set({
    credits: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log('テストユーザーを作成しました');
}

// createDesign のテスト
async function testCreateDesign(mockAuth) {
  console.log('\n>> createDesign 関数のテスト');
  try {
    const mockData = {
      prompt: 'テスト用デザイン',
      style: 'シンプル'
    };
    
    const request = createMockRequest(mockAuth, mockData);
    const result = await functions.createDesign(request);
    
    console.log('結果:', result);
    return result.id; // 次のテストで使用するためにIDを返す
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
}

// getDesign のテスト
async function testGetDesign(mockAuth, designId) {
  console.log('\n>> getDesign 関数のテスト');
  try {
    const mockData = {
      designId: designId
    };
    
    const request = createMockRequest(mockAuth, mockData);
    const result = await functions.getDesign(request);
    
    console.log('結果:', result);
  } catch (error) {
    console.error('エラー:', error);
  }
}

// createCheckoutSession のテスト
async function testCreateCheckoutSession(mockAuth) {
  console.log('\n>> createCheckoutSession 関数のテスト');
  try {
    const mockData = {
      priceId: 'price_test_12345', // テスト用価格ID
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel'
    };
    
    const request = createMockRequest(mockAuth, mockData);
    const result = await functions.createCheckoutSession(request);
    
    console.log('結果:', result);
  } catch (error) {
    console.error('エラー:', error);
    console.log('注意: Stripe APIキーが設定されていない場合はエラーになります');
  }
}

// stripeWebhook のテスト
async function testStripeWebhook() {
  console.log('\n>> stripeWebhook 関数のテスト');
  try {
    // HTTPリクエスト/レスポンスをシミュレート
    const req = {
      headers: {
        'stripe-signature': 'test_signature'
      },
      rawBody: JSON.stringify({
        type: 'checkout.session.completed',
        data: {
          object: {
            client_reference_id: 'test-user-id'
          }
        }
      })
    };
    
    const res = createMockResponse();
    
    await functions.stripeWebhook(req, res);
    console.log('レスポンス:', res);
  } catch (error) {
    console.error('エラー:', error);
    console.log('注意: Stripe Webhookシークレットが設定されていない場合はエラーになります');
  }
}

// updateUserCredits のテスト
async function testUpdateUserCredits(mockAuth) {
  console.log('\n>> updateUserCredits 関数のテスト');
  try {
    const mockData = {
      amount: 50
    };
    
    const request = createMockRequest(mockAuth, mockData);
    const result = await functions.updateUserCredits(request);
    
    console.log('結果:', result);
    
    // 結果を検証
    const userDoc = await admin.firestore().collection('users').doc(mockAuth.uid).get();
    console.log('更新後のユーザークレジット:', userDoc.data().credits);
  } catch (error) {
    console.error('エラー:', error);
  }
}

// テストデータのクリーンアップ
async function cleanupTestData(userId) {
  console.log('\n>> テストデータのクリーンアップ');
  try {
    // ユーザードキュメントを削除
    await admin.firestore().collection('users').doc(userId).delete();
    
    // ユーザーに関連するデザインを検索して削除
    const designs = await admin.firestore()
      .collection('designs')
      .where('userId', '==', userId)
      .get();
    
    const batch = admin.firestore().batch();
    designs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    if (!designs.empty) {
      await batch.commit();
    }
    
    console.log('テストデータをクリーンアップしました');
  } catch (error) {
    console.error('クリーンアップ中にエラーが発生しました:', error);
  }
}

// テストを実行
runTests().catch(console.error); 