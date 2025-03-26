// シンプルなテストスクリプト
console.log('Firebase Functions テスト開始');

try {
  // 関数をインポート
  const functions = require('./lib/index.js');
  
  // 利用可能な関数を表示
  console.log('利用可能な関数一覧:');
  Object.keys(functions).forEach(name => {
    console.log(` - ${name}`);
  });
  
  console.log('テスト完了');
} catch (error) {
  console.error('エラー発生:', error);
} 