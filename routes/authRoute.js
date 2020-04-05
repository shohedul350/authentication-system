const router = require('express').Router();
const registerValidator = require('../validator/authValidator/signupvalidator')
const loginValidator = require('../validator/authValidator/loginValidator')
const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    logoutController
} = require('../controllers/authController');

const {isUnAuthenticate} = require('../middleware/authMiddleware')

router.get('/signup',signupGetController);
router.post('/signup',registerValidator,signupPostController);

router.get('/login',loginGetController);
router.post('/login',loginValidator,loginPostController);

router.get('/logout',logoutController)



module.exports = router;