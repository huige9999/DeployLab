const express = require('express');
const router = express.Router();
const db = require('../db');
const redis = require('../redis');

router.get('/health', async (_req, res) => {
  try {
    // await db.query('SELECT 1');
    // 并发检查redis、db的健康状态
    const [redisResult, dbResult] = await Promise.allSettled([redis.ping(), db.query('SELECT 1')]);
    const redisOk = redisResult.status === 'fulfilled';
    const dbOk = dbResult.status === 'fulfilled';


    res.json({
      status: dbOk && redisOk ? 'ok' : 'degraded',
      db: dbOk ? 'ok' : 'down',
      redis: redisOk ? 'ok' : 'down',
      version: process.env.APP_VERSION || 'unknown',
    });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'down', error: e.message });
  }
});

module.exports = router;