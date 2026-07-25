const express = require('express');
const { protect } = require('../middlewares/auth');
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const bookingRouter = express.Router();

bookingRouter.post('/', protect, createBooking);
bookingRouter.get('/my', protect, getMyBookings);
bookingRouter.put('/:id/cancel', protect, cancelBooking);

module.exports = bookingRouter;