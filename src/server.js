const app = require('./app');
const { env } = require('./config/env');

app.listen(env.port, '0.0.0.0', () => {
  console.log(`AnimeTracker API running on http://localhost:${env.port}
AnimeTracker Swagger: http://localhost:${env.port}/api/docs`);
});
