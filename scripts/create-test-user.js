import fetch from 'node-fetch';

async function createTestUser() {
  try {
    // Auth Emulatorのエンドポイント
    const authEmulatorUrl = 'http://127.0.0.1:9199';
    
    // テストユーザーの情報
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
    };

    // ユーザーを作成（Auth REST APIを使用）
    const response = await fetch(
      `${authEmulatorUrl}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create user: ${JSON.stringify(error)}`);
    }

    const userData = await response.json();
    console.log('Test user created successfully!');
    console.log('User ID:', userData.localId);
    console.log('ID Token:', userData.idToken);
    
    // このトークンをcURLリクエストに使用できます
    console.log('\nトークンを使ってCloud Functionsをテストするコマンド:');
    console.log(`curl -X POST "http://127.0.0.1:5001/t2design-79508/asia-northeast1/createDesign" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${userData.idToken}" \\
  -d '{"data": {"prompt": "テストプロンプト", "style": "モダン"}}'`);

    return userData;
  } catch (error) {
    console.error('Error creating test user:', error.message);
    process.exit(1);
  }
}

createTestUser(); 