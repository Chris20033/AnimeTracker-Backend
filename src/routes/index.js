const { Router } = require('express');

const authRoutes = require('./auth.routes');
const docsRoutes = require('./docs.routes');
const healthRoutes = require('./health.routes');

const router = Router();

router.use('/docs', docsRoutes);
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

module.exports = router;
