const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');

const { openApiSpec } = require('../docs/openapi');

const router = Router();

router.get('/openapi.json', (req, res) => res.json(openApiSpec));
router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec));

module.exports = router;
