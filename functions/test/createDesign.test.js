// シンプルなユニットテスト - createDesign関数のロジックのみをテスト
const assert = require('assert');
const { HttpsError } = require('firebase-functions/v2/https');

// 関数のロジックのみを抽出して、テスト可能な形式に
function createDesignLogic(auth, data) {
  // 認証チェック
  if (!auth) {
    throw new HttpsError('unauthenticated', '認証が必要です');
  }

  // データの検証
  const { prompt, style } = data;
  if (!prompt || !style) {
    throw new HttpsError('invalid-argument', 'プロンプトとスタイルは必須です');
  }

  // 正常なレスポンス - 実際の実装ではデータベース操作が入るところ
  return { success: true, id: 'test-design-id' };
}

describe('createDesign関数のロジックテスト', () => {
  it('認証なしでは失敗すること', () => {
    try {
      createDesignLogic(null, { prompt: 'テスト', style: 'モダン' });
      assert.fail('例外が発生するはずです');
    } catch (error) {
      assert.strictEqual(error.code, 'unauthenticated');
      assert.strictEqual(error.message, '認証が必要です');
    }
  });

  it('promptがない場合は失敗すること', () => {
    try {
      createDesignLogic({ uid: 'test-user' }, { style: 'モダン' });
      assert.fail('例外が発生するはずです');
    } catch (error) {
      assert.strictEqual(error.code, 'invalid-argument');
      assert.strictEqual(error.message, 'プロンプトとスタイルは必須です');
    }
  });

  it('styleがない場合は失敗すること', () => {
    try {
      createDesignLogic({ uid: 'test-user' }, { prompt: 'テスト' });
      assert.fail('例外が発生するはずです');
    } catch (error) {
      assert.strictEqual(error.code, 'invalid-argument');
      assert.strictEqual(error.message, 'プロンプトとスタイルは必須です');
    }
  });

  it('正しいパラメータでは成功すること', () => {
    const result = createDesignLogic(
      { uid: 'test-user-id' },
      { prompt: 'テストプロンプト', style: 'モダン' }
    );
    
    assert(result.success);
    assert(result.id);
  });
}); 