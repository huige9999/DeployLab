const express = require('express');
const router = express.Router();
const db = require('../db');

const VALID_STATUS = ['todo', 'doing', 'done'];

// GET /api/tasks —— 列表
router.get('/', async (_req, res) => {
  const [rows] = await db.query('SELECT * FROM tasks ORDER BY id DESC');
  res.json(rows);
});

// POST /api/tasks —— 新增
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'title 不能为空' });
  }
  const [r] = await db.query(
    'INSERT INTO tasks (title) VALUES (?)',
    [title.trim()]
  );
  res.status(201).json({ id: r.insertId, title: title.trim(), status: 'todo' });
});

// PATCH /api/tasks/:id/status —— 改状态
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUS.includes(status)) {
    return res.status(400).json({ error: `status 必须是 ${VALID_STATUS.join('/')}` });
  }
  const [r] = await db.query(
    'UPDATE tasks SET status=? WHERE id=?',
    [status, req.params.id]
  );
  if (r.affectedRows === 0) return res.status(404).json({ error: 'task 不存在' });
  res.json({ id: Number(req.params.id), status });
});

// DELETE /api/tasks/:id —— 删除
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM tasks WHERE id=?', [req.params.id]);
  res.status(204).end();
});

module.exports = router;