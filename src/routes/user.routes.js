const { Router } = require('express');

const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { updateMeSchema } = require('../schemas/user.schema');

const router = Router();

router.get('/me', authMiddleware, userController.getMe);
router.patch('/me', authMiddleware, validate(updateMeSchema), userController.updateMe);
router.get('/:username', userController.getPublicProfile);

module.exports = router;
