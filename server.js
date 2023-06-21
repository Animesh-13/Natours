const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(process.env);
const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successfull!'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('APP is running');
});
