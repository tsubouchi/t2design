# t2design

AIを使って高品質なデザインを自動生成するWebアプリケーション

## 実装済み機能 ✅

### 認証・アカウント
- [x] Googleアカウントでのログイン/ログアウト
- [x] ユーザープロフィール管理
- [x] 認証状態の永続化

### UI/UX
- [x] レスポンシブデザイン
- [x] ダークモード/ライトモード切り替え
- [x] モダンなUIコンポーネント（shadcn/ui）
- [x] ローディング状態の表示
- [x] トースト通知

### 基本機能
- [x] ダッシュボード表示
- [x] デザイン生成履歴
- [x] 生成したデザインのプレビュー
- [x] SVG/PNGダウンロード
- [x] クレジット残高表示

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

## ライセンス

© 2025 t2design. All rights reserved. 