const express = require('express');
const cors = require('cors');

const { corsOptions } = require('./config/cors');
const routes = require('./routes');
const { getHealth } = require('./controllers/health.controller');
const { errorMiddleware } = require('./middlewares/error.middleware');
const { notFoundMiddleware } = require('./middlewares/notFound.middleware');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', getHealth);
app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
