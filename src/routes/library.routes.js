const { Router } = require('express');

const libraryController = require('../controllers/library.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { addLibrarySchema, deleteLibrarySchema, getLibrarySchema, updateLibrarySchema } = require('../schemas/library.schema');

const router = Router();

router.use(authMiddleware);

router.get('/', validate(getLibrarySchema), libraryController.getLibrary);
router.post('/', validate(addLibrarySchema), libraryController.addToLibrary);
router.patch('/:id', validate(updateLibrarySchema), libraryController.updateLibraryEntry);
router.delete('/:id', validate(deleteLibrarySchema), libraryController.deleteLibraryEntry);

module.exports = router;
