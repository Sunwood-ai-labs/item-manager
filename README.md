<div align="center">

# ✨ 物品管理アプリケーション ✨

![物品管理システム](https://img.shields.io/badge/物品管理-システム-blue)

</div>

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v20-brightgreen)
![Express](https://img.shields.io/badge/Express-v4.18-lightgrey)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-9cf)
![Bootstrap](https://img.shields.io/badge/Bootstrap-v5.3-purple)

</div>

## 📋 概要

このアプリケーションは、オフィスや倉庫の物品を簡単に管理するためのシンプルなウェブアプリケーションです。物品の追加、編集、削除、閲覧などの基本的な機能を提供し、効率的な在庫管理をサポートします。

## ✨ 特徴

- 🔍 物品の検索とリスト表示
- ➕ 新規物品の追加
- 📝 物品情報の編集
- 🗑️ 物品の削除
- 📊 カテゴリによる分類
- 💼 在庫数量の視覚的表示（色分け）
- 📱 レスポンシブデザイン

## 🛠️ 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript, Bootstrap 5
- **バックエンド**: Node.js, Express.js
- **データベース**: PostgreSQL
- **開発環境**: Docker, Docker Compose

## 📥 インストール方法

### 前提条件

- Docker と Docker Compose がインストールされていること
- Git がインストールされていること

### セットアップ手順

1. リポジトリをクローン:

```bash
git clone <リポジトリURL>
cd item_manager
```

2. Docker Composeでアプリケーションを起動:

```bash
docker-compose up -d
```

3. ブラウザでアプリケーションにアクセス:

```
http://localhost:9999
```

## 📖 使用方法

### 物品の追加

1. 「新規物品登録」フォームに必要情報を入力
2. 「登録する」ボタンをクリック

### 物品の検索

1. 右上の検索ボックスに検索キーワードを入力
2. 検索ボタンをクリックまたはEnterキーを押す

### 物品の編集

1. 編集したい物品の行にある「編集」ボタンをクリック
2. 情報を更新して「更新する」ボタンをクリック

### 物品の削除

1. 削除したい物品の行にある「削除」ボタンをクリック
2. 確認ダイアログで「削除する」ボタンをクリック

## 📁 プロジェクト構造

```
item_manager/
├── db/                  # データベース関連ファイル
│   ├── data/            # PostgreSQLデータ（gitignore）
│   └── init/            # 初期化SQLスクリプト
├── public/              # 静的ファイル
│   ├── js/              # フロントエンドJavaScript
│   │   └── app.js       # メインJavaScriptファイル
│   ├── index.html       # メインHTML
│   └── style.css        # CSSスタイル
├── src/                 # バックエンドソースコード
│   ├── routes/          # APIルート定義
│   └── app.js           # Expressアプリケーション
├── .gitignore           # Gitの除外ファイル設定
├── docker-compose.yml   # Docker Compose設定
├── Dockerfile           # Nodeアプリ用Dockerfile
├── package.json         # npmパッケージ設定
└── README.md            # プロジェクト説明
```

## 🧪 開発とテスト

### 開発モード

開発モードでは、コード変更時に自動的にサーバーが再起動します:

```bash
docker-compose down
docker-compose up -d
```

### ログの確認

アプリケーションのログを確認:

```bash
docker logs -f item-manager-app
```

データベースのログを確認:

```bash
docker logs -f item-manager-db
```

## 📋 API仕様

| エンドポイント | メソッド | 説明 |
|--------------|--------|------|
| `/api/items` | GET    | 全ての物品を取得 |
| `/api/items/:id` | GET    | 特定IDの物品を取得 |
| `/api/items` | POST   | 新しい物品を追加 |
| `/api/items/:id` | PUT    | 物品情報を更新 |
| `/api/items/:id` | DELETE | 物品を削除 |
| `/api/categories` | GET    | 全てのカテゴリを取得 |

## 📝 ライセンス

[MIT](LICENSE)

## 👥 貢献

プルリクエスト大歓迎です！大きな変更を行う場合は、まずissueを開いて変更内容について議論してください。
