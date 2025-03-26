# t2design

AIを使って高品質なデザインを自動生成するWebアプリケーション

## 実装済み機能 ✅

### 認証・アカウント
- [x] Googleアカウントでのログイン/ログアウト
  - メインページ（`/`）に統合されたログイン機能
  - ログイン後は自動的にメインページに遷移
  - 認証状態は`browserLocalPersistence`で永続化
  - ログイン状態に応じたUIの切り替え
- [x] ユーザープロフィール管理
  - ユーザー名、メールアドレス、プロフィール画像の表示
  - ヘッダーのドロップダウンメニューでプロフィール表示
- [x] 認証状態の永続化
  - Firebaseの`setPersistence`を使用
  - ブラウザを閉じてもログイン状態を維持
  - セッション切れを防止

### UI/UX
- [x] レスポンシブデザイン
  - モバイル、タブレット、デスクトップ対応
  - グリッドレイアウトの自動調整
- [x] ダークモード/ライトモード切り替え
  - システム設定に連動
  - 手動切り替えも可能
- [x] モダンなUIコンポーネント（shadcn/ui）
  - カード、ボタン、ドロップダウンメニューなど
  - アクセシビリティ対応
- [x] ローディング状態の表示
  - ページ読み込み中のインジケータ
  - 認証状態確認中の表示
- [x] トースト通知
  - ログイン/ログアウト時のフィードバック
  - エラー発生時の通知

### 基本機能
- [x] ダッシュボード表示
  - ログイン後のメインページに機能カードを表示
  - デザイン作成、履歴、クレジット管理、デモへのアクセス
- [x] デザイン生成履歴
  - 生成したデザインの一覧表示
  - 履歴からの再生成機能
- [x] 生成したデザインのプレビュー
  - SVG/PNG形式でのプレビュー
  - 複数バリエーションの表示
- [x] SVG/PNGダウンロード
  - 生成したデザインのダウンロード機能
  - 形式選択による出力
- [x] クレジット残高表示
  - ヘッダーでの残高表示
  - クレジット管理ページでの詳細表示

## 未実装機能 🚧

### AI生成機能
- [ ] Claude Sonet 3.7によるSVG生成
- [ ] fal.aiによる画像生成
- [ ] プロンプトテンプレート
- [ ] 生成結果の再生成機能
- [ ] 参照画像のアップロード

### 課金システム
- [ ] Stripe決済連携
- [ ] サブスクリプションプラン管理
  - [ ] 無料プラン (月5回)
  - [ ] 一般プラン (月100回)
  - [ ] Proプラン (月500回)
- [ ] クレジット追加購入
- [ ] クレジット消費ロジック
- [ ] 毎月のクレジットリセット

### コミュニティ機能
- [ ] 生成したデザインの公開設定
- [ ] コミュニティフィード
- [ ] いいね/コメント機能
- [ ] フォロー機能

### 管理者機能
- [ ] ユーザー管理
- [ ] 作品管理
- [ ] システム設定
- [ ] 利用統計

## 技術スタック

- Next.js 15.1.0
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Firebase
  - Authentication
  - Realtime Database
  - Storage
  - Hosting

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/tsubouchi/t2design.git
cd t2design

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

## 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url

# fal.ai設定
NEXT_PUBLIC_FAL_KEY=your_fal_ai_key

# Stripe設定
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_BASE_URL=your_app_url

# サブスクリプションプラン
NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=your_standard_price_id
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=your_pro_price_id

# クレジット購入プラン
NEXT_PUBLIC_STRIPE_CREDIT_100_PRICE_ID=your_credit_100_price_id
NEXT_PUBLIC_STRIPE_CREDIT_500_PRICE_ID=your_credit_500_price_id
NEXT_PUBLIC_STRIPE_CREDIT_1000_PRICE_ID=your_credit_1000_price_id
NEXT_PUBLIC_STRIPE_CREDIT_3000_PRICE_ID=your_credit_3000_price_id
```

## デプロイ

```bash
# プロダクションビルド
pnpm build

# Firebaseへのデプロイ
firebase deploy
```

## 注意点

### 認証関連
- ログイン機能は`/login`ではなく、メインページ（`/`）に統合されています
- ログイン後は自動的にメインページに遷移します
- 認証状態は`browserLocalPersistence`で永続化されます
- ログイン状態に応じてUIが切り替わります

### 開発時の注意点
- ポート3000が使用中の場合は、自動的に次のポートが使用されます
- 開発サーバー起動時は、Firebaseの初期化ログが表示されます
- 認証状態の変更はコンソールにログ出力されます

### エラー処理
- エラーページ（`app/error.tsx`）とローディングページ（`app/loading.tsx`）が実装されています
- 認証エラー時は適切なエラーメッセージが表示されます
- ネットワークエラー時は再試行が可能です

## ライセンス

© 2025 t2design. All rights reserved. 