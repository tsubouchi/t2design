// Firebase エミュレーターを使用するテストスクリプト
const admin = require('firebase-admin');
const functions = require('./lib/index.js');

// Firebase エミュレーター使用の設定
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// Firebase Admin初期化（エミュレーター用）
admin.initializeApp({
  projectId: 't2design-79508'
});

// テストコード（以下は既存のtest-functions.jsと同様）
// ... 