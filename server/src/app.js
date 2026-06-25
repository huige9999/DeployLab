require('dotenv').config();
const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');
const tasksRouter = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/tasks', tasksRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});