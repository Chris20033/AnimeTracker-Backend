const { Router } = require('express');

const statisticsController = require('../controllers/statistics.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { publicStatisticsSchema } = require('../schemas/statistics.schema');

const router = Router();

router.get('/me', authMiddleware, statisticsController.getMyStatistics);
router.get('/users/:username', validate(publicStatisticsSchema), statisticsController.getPublicStatistics);

module.exports = router;
