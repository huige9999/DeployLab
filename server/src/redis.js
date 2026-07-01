const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    // 重连策略
    retryStrategy: (times) => {
        const delay = Math.min(times * 500, 3000);
        return delay;
    },
    // 最大的重连单次请求次数
    maxRetriesPerRequest: 1
});

// 监听connect和error事件
redis.on('connect', () => {
    console.log('Redis connected');
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redis;