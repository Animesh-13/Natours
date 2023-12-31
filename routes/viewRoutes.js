const express = require('express');
const viewController = require('./../controllers/viewController');
const router = express.Router();
const authController = require('../controllers/authController');

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);
router.get('/signUp', viewController.getSignUpForm);

module.exports = router;
