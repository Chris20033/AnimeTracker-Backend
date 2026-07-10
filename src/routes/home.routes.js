const { Router } = require('express');

const homeController = require('../controllers/home.controller');

const router = Router();

router.get('/', homeController.getHome);
router.get('/featured', homeController.getFeatured);
router.get('/top-airing', homeController.getTopAiring);
router.get('/seasonal', homeController.getSeasonal);
router.get('/upcoming', homeController.getUpcoming);
router.get('/popular', homeController.getPopular);
router.get('/recommendations', homeController.getRecommendations);

module.exports = router;
