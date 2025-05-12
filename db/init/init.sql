-- 物品テーブル作成
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price NUMERIC(10, 2),
  location VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- カテゴリテーブル作成
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- サンプルカテゴリ挿入
INSERT INTO categories (name, description) VALUES
  ('事務用品', 'オフィス用の事務用品'),
  ('電子機器', 'パソコンや周辺機器など'),
  ('家具', 'オフィス家具や収納'),
  ('消耗品', '定期的に補充が必要なアイテム');

-- サンプル物品データ挿入
INSERT INTO items (name, description, category, quantity, unit_price, location) VALUES
  ('ノートパソコン', 'ビジネス用15インチノートPC', '電子機器', 10, 120000, '技術部保管庫'),
  ('オフィスチェア', '人間工学に基づいた椅子', '家具', 15, 35000, '倉庫A-2'),
  ('A4コピー用紙', '500枚入り高品質コピー用紙', '消耗品', 50, 500, '事務所棚B'),
  ('ボールペン（黒）', '油性ボールペン 10本セット', '事務用品', 30, 300, '事務所引き出しC');
