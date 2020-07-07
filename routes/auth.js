const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const error = new Error('Username already exists');
      error.code = 422;
      return next(error);
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();
    res.status(201).json({ message: 'Success' });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.code = 401;
      return next(error);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.code = 401;
      return next(error);
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username,
      },
      'supersecret'
    );
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
