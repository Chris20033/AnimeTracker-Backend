const { Router } = require('express');

const favoriteController = require('../controllers/favorite.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { addFavoriteSchema, deleteFavoriteSchema } = require('../schemas/favorite.schema');

const router = Router();

router.use(authMiddleware);

router.get('/', favoriteController.getFavorites);
router.post('/', validate(addFavoriteSchema), favoriteController.addFavorite);
router.delete('/:id', validate(deleteFavoriteSchema), favoriteController.deleteFavorite);

module.exports = router;
