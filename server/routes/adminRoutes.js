const express = require('express');
const {adminOnly, protect} = require('../middlewares/auth');
const {getAllRestaurants, approveRestaurant, getAdminStats} = require('../controllers/adminController');

const adminRouter = express.Router();

adminRouter.use(protect);
adminRouter.use(adminOnly);

adminRouter.get('/restaurants', getAllRestaurants);
adminRouter.put('/restaurants/:id/approve', approveRestaurant);
adminRouter.get('/stats', getAdminStats);

module.exports = adminRouter;