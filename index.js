const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use((error, req, res, next) => {
  console.log(error.message);
  const { code, message } = error;
  if (code && message) {
    return res.status(code).json({ message });
  }
  return res.status(500).json({ message: 'Problem occurred' });
});

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log('Connected to database'));

app.listen(5000, () => console.log('listening on *: 5000'));
