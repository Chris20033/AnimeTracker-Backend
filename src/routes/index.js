const { Router } = require('express');

const authRoutes = require('./auth.routes');
const animeRoutes = require('./anime.routes');
const docsRoutes = require('./docs.routes');
const healthRoutes = require('./health.routes');
const homeRoutes = require('./home.routes');
const userRoutes = require('./user.routes');

const router = Router();

router.use('/docs', docsRoutes);
router.use('/health', healthRoutes);
router.use('/home', homeRoutes);
router.use('/auth', authRoutes);
router.use('/anime', animeRoutes);
router.use('/users', userRoutes);

module.exports = router;
