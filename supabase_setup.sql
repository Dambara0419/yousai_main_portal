-- ======================================
-- YouSai ポータル Supabase 初期設定SQL
-- ======================================
-- Supabaseダッシュボードの SQL Editor で実行してください

-- カテゴリテーブル
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ツールテーブル
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  icon_url TEXT
);

-- Row Level Security を有効化
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーの読み取りを許可（書き込みはダッシュボードから管理者のみ）
CREATE POLICY "anon read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "anon read tools" ON tools
  FOR SELECT USING (true);

-- ======================================
-- サンプルデータ（初期テスト用）
-- ======================================
INSERT INTO categories (name, sort_order) VALUES
  ('業務システム', 1),
  ('ドキュメント', 2),
  ('開発ツール', 3),
  ('コミュニケーション', 4)
ON CONFLICT DO NOTHING;

-- ツールのサンプルデータはカテゴリIDが必要なため、
-- Supabaseダッシュボードの Table Editor から直接追加してください
