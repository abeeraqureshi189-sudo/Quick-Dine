const express = require('express');
const {getRestaurants, getFeaturedRestaurants, getRestaurantsBySlug, getRestaurantsAvailability} = require('../controllers/restaurantController');

const restaurantRouter = express.Router();

restaurantRouter.get('/', getRestaurants);
restaurantRouter.get('/featured', getFeaturedRestaurants);
restaurantRouter.get('/:slug', getRestaurantsBySlug);
restaurantRouter.get('/:id/availability', getRestaurantsAvailability);

module.exports = restaurantRouter;