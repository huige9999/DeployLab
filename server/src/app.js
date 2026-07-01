require('dotenv').config();
const express = require('express');
const cors = require('cors');

const redis = require('./redis');

const healthRouter = require('./routes/health');
const tasksRouter = require('./routes/tasks');
const statsRouter = require('./routes/stats');

const app = express();
app.use(cors());
app.use(express.json());


// 访问业务路由之前的计数中间件
app.use('/api', async (req, res, next) => {
    try {
      await redis.incr('api:request_count');
    }catch (error) {
      console.error('Error incrementing request count in Redis:', error);
    }
    next();
});


app.use('/api', healthRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/stats', statsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});