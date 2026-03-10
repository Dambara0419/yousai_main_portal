# 社内ツールポータルサイト 要件定義書

あなたは優秀なフルスタックエンジニアです。以下の要件定義に基づき、社内用便利ツールポータルサイトの設計と初期実装のコードを出力してください。

## 1. プロジェクト概要
社内で利用している各種システムやドキュメントへのリンクを1箇所に集約したポータルサイトを開発する。さらに、目玉機能として最新のGemini APIを活用した「AI画像生成ツール」をポータル内に実装する。
管理・運用の手間を最小限にするため、極力シンプルなアーキテクチャを採用する。

## 2. システム構成・技術スタック
* フロントエンド: React (Vite) + TypeScript + Tailwind CSS
* ホスティング: Cloudflare Pages
* バックエンド (APIプロキシ): Cloudflare Pages Functions
* データベース: Supabase
* 認証・アクセス制御: Cloudflare Zero Trust (Access) または ベーシック認証を利用（※アプリ側でのログイン実装は不要）
* データ状態管理: お気に入り機能はブラウザのLocal Storageを使用

## 3. 機能要件

### 3.1 ポータル基本機能
* ツール一覧表示: Supabaseから取得したツール情報をカテゴリ別にタイル状で一覧表示する。
* 検索機能: ツール名やキーワードでインクリメンタルサーチ（リアルタイム絞り込み）ができる。
* お気に入り機能: 各ツールに「☆」ボタンを設け、クリックでLocal Storageに保存。お気に入り登録したツールはトップ画面上部に優先表示される。

### 3.2 AI画像生成機能
* 概要: ユーザーが入力したプロンプトと参考画像をもとに、新しい画像を生成・表示する。
* 利用モデル: Gemini API (`gemini-3.1-flash-image-preview`)
* 参考ドキュメント: https://ai.google.dev/gemini-api/docs/models?hl=ja
* 入力インターフェース: テキスト入力欄（プロンプト）および画像アップロードエリア（ドラッグ＆ドロップ対応）。
* 出力インターフェース: 生成された画像の表示エリアと、ダウンロードボタン。ローディング中のUIも実装する。
* セキュリティ要件: フロントエンドから直接Gemini APIを呼び出さず、必ずCloudflare Pages Functions (`/functions/api/generate-image.ts` など) をプロキシとして作成し、環境変数経由でAPIキーを使用する。

## 4. データベース設計 (Supabase)
管理画面は開発せず、Supabaseのダッシュボードから直接レコードを追加・編集する運用とするため、テーブルは以下の2つのみ。

**categories テーブル**
* `id`: UUID (Primary Key)
* `name`: String (カテゴリ名)
* `sort_order`: Integer (表示順)

**tools テーブル**
* `id`: UUID (Primary Key)
* `category_id`: UUID (Foreign Key -> categories.id)
* `title`: String (ツール名)
* `description`: Text (説明文)
* `url`: String (リンク先URL)
* `icon_url`: String (アイコン画像のURL、任意)

## 5. 最初の依頼事項
上記の要件を理解した上で、まずは以下の3点を出力してください。
1. プロジェクトのディレクトリ構成案
2. フロントエンドのベースとなるトップページコンポーネントのコード（ツール一覧とLocal Storageを使ったお気に入り機能の実装）
3. AI画像生成機能のための、Cloudflare Pages Functions (`/functions/api/generate-image.ts`) の実装コードと、環境変数の設定手順