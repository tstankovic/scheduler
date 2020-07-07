const express = require('express');
const router = express.Router();
const passport = require('passport');

const Event = require('../model/Event');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const userId = req.user.id;
    try {
      const events = await Event.find({ user: userId });
      res.status(200).json({ events });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const userId = req.user.id;
    const { description, day, month, year } = req.body;
    try {
      const existingEvent = await Event.findOne({
        day,
        month,
        year,
        user: userId,
      });
      if (existingEvent) {
        const error = new Error('Event for this date already exists');
        error.code = 422;
        return next(error);
      }
      const event = new Event({ description, day, month, year, user: userId });
      await event.save();
      res.status(201).json({ message: 'Success' });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { id, description } = req.body;
    try {
      const event = await Event.findById(id);
      event.description = description;
      await event.save();
      res.status(204).json({ message: 'Success' });
    } catch (err) {
      next(err);
    }
  }
);

// TODO delete (can only delete his own events)
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { id } = req.body;
    const userId = req.user.id;
    try {
      const event = await Event.findById(id);
      if (userId != event.user) {
        const error = new Error('Unauthorized');
        error.code = 401;
        return next(err);
      }
      await Event.deleteOne({ _id: id });
      res.status(204).json({ message: 'Success' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
