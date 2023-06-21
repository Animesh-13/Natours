const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Use of MIDDLEWARE ------------->
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));
//////////////////////////////////////////////////

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'hell000o from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('you can post to this endpoint....');
// });

// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', UpdateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Start Server

module.exports = app;
