const { RegisterUser, LoginUser, isAuthenticated, VerifyTokenMiddleware, Profile} = require('../Controller/UserController');
const router = require('express').Router();
const passport = require('passport');



router.post('/register', RegisterUser );
router.post('/login', passport.authenticate('local'), LoginUser);
router.post('/isAuthenticated', isAuthenticated);
router.get('/profile', VerifyTokenMiddleware, Profile);

module.exports = router;