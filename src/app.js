const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Express アプリケーション作成
const app = express();
const port = process.env.PORT || 9999;

// PostgreSQL接続設定
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'items_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// データベース接続テスト
pool.connect((err, client, done) => {
  if (err) {
    console.error('データベース接続エラー:', err);
  } else {
    console.log('データベース接続成功');
    done();
  }
});

// ミドルウェア
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ルート（静的ファイル配信）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// 物品API
// 全ての物品を取得
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('物品取得エラー:', err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

// 特定の物品を取得
app.get('/api/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '物品が見つかりません' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('物品取得エラー:', err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

// 物品を追加
app.post('/api/items', async (req, res) => {
  const { name, description, category, quantity, unit_price, location } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO items (name, description, category, quantity, unit_price, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, category, quantity, unit_price, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('物品追加エラー:', err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

// 物品を更新
app.put('/api/items/:id', async (req, res) => {
  const id = req.params.id;
  const { name, description, category, quantity, unit_price, location } = req.body;
  try {
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, category = $3, quantity = $4, unit_price = $5, location = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, description, category, quantity, unit_price, location, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '物品が見つかりません' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('物品更新エラー:', err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

// 物品を削除
app.delete('/api/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '物品が見つかりません' });
    }
    res.json({ message: '削除完了', item: result.rows[0] });
  } catch (err) {
    console.error('物品削除エラー:', err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

// カテゴリAPI
// 全てのカテゴリを取得
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('カテゴリ取得エラー:', err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

// サーバー起動
app.listen(port, '0.0.0.0', () => {
  console.log(`サーバーが http://0.0.0.0:${port} で起動しました`);
});
