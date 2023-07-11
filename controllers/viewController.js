const { render } = require('pug');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // 1) Get the data,for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour name'), 404);
  }

  // 2)Build template
  // 3) Render template using data 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js 'unsafe-inline' 'unsafe-eval';"
    )
    .render('login', {
      title: 'Log into your account',
    });
};
// exports.getLoginForm = (req, res) => {
//   res.status(200).render('login', {
//     title: 'Login with an account',
//   });
// };
exports.getSignUpForm = (req, res) => {
  res.status(200).render('signUp', {
    title: 'SignUp with an account',
  });
};
