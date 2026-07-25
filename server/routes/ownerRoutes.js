const express = require('express');
const {ownerOnly, protect} = require('../middlewares/auth');
const upload = require('../config/multer');
const { getOwnerBookings, createOwnerRestaurant, updateOwnerRestaurant, updateBookingStatus, getOwnerRestaurant} = require('../controllers/ownerController');

const ownerRouter = express.Router();

ownerRouter.use(protect);
ownerRouter.use(ownerOnly);

ownerRouter.get('/restaurant', getOwnerRestaurant);
ownerRouter.post('/restaurant', upload.single('image'), createOwnerRestaurant);
ownerRouter.put('/restaurant', upload.single('image'), updateOwnerRestaurant);
ownerRouter.get('/bookings', getOwnerBookings);
ownerRouter.put('/bookings/:id/status', updateBookingStatus);

module.exports = ownerRouter;