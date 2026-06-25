const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      status: 'ok',
      db: 'ok',
      redis: 'pending',       // Redis 第 4 阶段才接
      version: process.env.APP_VERSION || 'unknown',
    });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'down', error: e.message });
  }
});

module.exports = router;