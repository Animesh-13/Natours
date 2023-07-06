const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();
const authController = require('./../controllers/authController');

// router.param('id', tourController.checkId);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.getAllTour)
  .post(tourController.checkBody, tourController.createTour);

module.exports = router;
