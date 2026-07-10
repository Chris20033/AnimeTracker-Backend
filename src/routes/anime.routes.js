const { Router } = require('express');

const animeController = require('../controllers/anime.controller');
const { validate } = require('../middlewares/validate.middleware');
const { animeDetailSchema, catalogAnimeSchema, searchAnimeSchema } = require('../schemas/anime.schema');

const router = Router();

router.get('/search', validate(searchAnimeSchema), animeController.searchAnime);
router.get('/catalog', validate(catalogAnimeSchema), animeController.getAnimeCatalog);
router.get('/genres', animeController.getAnimeGenres);
router.get('/:source/:externalId', validate(animeDetailSchema), animeController.getAnimeDetail);

module.exports = router;
