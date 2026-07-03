const app = require('./app');
const { env } = require('./config/env');

app.listen(env.port, () => {
  console.log(`AnimeTracker API running on http://localhost:${env.port}
AnimeTracker Swagger: http://localhost:${env.port}/api/docs`);
});
