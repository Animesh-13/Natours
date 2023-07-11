const express = require('express');
const viewController = require('./../controllers/viewController');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', viewController.getOverview);
router.get('/tour/:slug', authController.protect, viewController.getTour);

router.get('/login', viewController.getLoginForm);
router.get('/signUp', viewController.getSignUpForm);

module.exports = router;
