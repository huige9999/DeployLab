const express = require('express');
const router = express.Router();
const redis = require('../redis');


// GET /api/stats 返回Redis里的访问计数
router.get('/', async (req, res) => {
    try {
        const count = await redis.get('api:request_count');
        res.json({ 
            request_count: Number(count) || 0,
            source: 'redis'
         });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message
         });
    }
});

module.exports = router;