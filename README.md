# Yarisugi Dashboard

顧客データ、FAQ、ビジネスオペレーションを管理するための包括的なReactベースのダッシュボードアプリケーションです。

## 機能

- **顧客管理**: 詳細なフォームで顧客情報を追加・管理
- **FAQビルダー**: AIアシスタンス付きでよくある質問を作成・整理
- **データベース管理**: ナレッジベース用のドキュメントをアップロード・処理
- **AI統合**: アップロードされたコンテンツから自動的にFAQを生成
- **レポート機能**: 包括的なビジネスレポートを生成
- **レスポンシブデザイン**: モバイルフレンドリーなインターフェースのモダンUI
- **API連携**: RESTful APIを使用した顧客データの管理

## 技術スタック

- **フロントエンド**: React 19.1.0
- **ビルドツール**: Vite 7.0.4
- **スタイリング**: モダンデザインパターンを使用したCSS
- **リンティング**: React固有のルールを含むESLint
- **API**: RESTful API（Lambda + API Gateway）

## はじめに

### 前提条件

- Node.js（バージョン16以上）
- npmまたはyarn

### インストール

1. リポジトリをクローン:
```bash
git clone <repository-url>
cd yarisugi-dashboard
```

2. 依存関係をインストール:
```bash
npm install
```

3. 開発サーバーを起動:
```bash
npm run dev
```

4. ブラウザを開いて `http://localhost:5173` にアクセス

### 利用可能なスクリプト

- `npm run dev` - ホットリロード付きで開発サーバーを起動
- `npm run build` - 本番用にビルド
- `npm run preview` - 本番ビルドをプレビュー
- `npm run lint` - ESLintを実行してコード品質をチェック

## プロジェクト構造

```
src/
├── App.jsx                 # メインアプリケーションコンポーネント
├── YarisugiDashboard.jsx   # コアダッシュボードコンポーネント
├── main.jsx               # アプリケーションエントリーポイント
├── index.css              # グローバルスタイル
└── assets/                # 静的アセット
```

## 機能概要

### 顧客管理
- 包括的な情報で新しい顧客を追加
- 顧客ステータスと営業担当者の割り当てを追跡
- 顧客レポートを生成
- **API連携**: RESTful APIを使用したCRUD操作
  - 顧客一覧取得（GET /customers）
  - 新規顧客登録（POST /customers）
  - 顧客情報更新（PUT /customers/{id}）
  - 顧客情報削除（DELETE /customers/{id}）

### FAQシステム
- FAQの作成とカテゴリ分け
- ドキュメントからのAI駆動FAQ生成
- 検索・フィルター機能
- カスタムカテゴリサポート

### ドキュメント処理
- 様々なファイル形式のアップロード
- AI支援コンテンツ分析
- アップロードされたコンテンツからの自動FAQ生成

## 最近の更新

### v1.1.0 - API連携の実装
- **顧客管理APIの統合**: Lambda + API Gatewayを使用したRESTful APIとの連携
- **CRUD操作の実装**: 顧客の作成・読み取り・更新・削除機能
- **レスポンシブデザインの改善**: 画面サイズに応じた動的なレイアウト調整
- **モーダルUIの追加**: 顧客登録・編集用のモーダルインターフェース

### v1.0.0 - 初期リリース
- 基本的なダッシュボード機能
- FAQ管理システム
- ナレッジベース機能

## API仕様

### 顧客管理API
- **ベースURL**: `https://dwv8xlyuuk.execute-api.ap-northeast-1.amazonaws.com/prod`
- **エンドポイント**:
  - `GET /customers` - 顧客一覧取得
  - `POST /customers` - 新規顧客登録
  - `GET /customers/{id}` - 顧客詳細取得
  - `PUT /customers/{id}` - 顧客情報更新
  - `DELETE /customers/{id}` - 顧客情報削除

### データ構造
```json
{
  "customerId": "string",
  "companyName": "string",
  "customerName": "string",
  "location": "string",
  "industry": "string",
  "siteUrl": "string",
  "snsStatus": "string",
  "lineId": "string",
  "email": "string",
  "salesPerson": "string",
  "status": "string",
  "updatedAt": "string"
}
```

## 開発者向け情報

### レスポンシブデザイン
- ブレークポイント: 480px, 768px, 1024px
- モバイルファーストアプローチ
- Tailwind CSSライクなユーティリティクラス

### 状態管理
- React Hooks（useState, useEffect）を使用
- モーダル状態の管理
- API通信状態の管理

## コントリビューション

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはプライベートでプロプライエタリです。

## サポート

サポートやご質問については、開発チームまでお問い合わせください。
