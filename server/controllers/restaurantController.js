import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";
import { User } from "../models/user.js";
import { Booking } from "../models/Booking.js";

// Get all restaurants with search and filters
// GET /api/restaurants
export const getRestaurants = async (req, res) => {
  try {
    const { search, priceRange, rating, location, sort } = req.query;

    // Build query object
    const queryObj = {
      status: "approved",
    };

    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (priceRange) {
      const prices = Array.isArray(priceRange)
        ? priceRange
        : [priceRange];

      queryObj.priceRange = {
        $in: prices,
      };
    }

    if (rating) {
      queryObj.rating = {
        $gte: parseFloat(rating),
      };
    }

    if (location) {
      queryObj.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "price-low") {
      sortOption = { priceRange: 1 };
    } else if (sort === "price-high") {
      sortOption = { priceRange: -1 };
    }

    const restaurants = await Restaurant.find(queryObj).sort(sortOption);

    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

// Get featured restaurants
// GET /api/restaurants/featured
export const getFeaturedRestaurants = async (req, res) => {
  try {
    const featured = await Restaurant.find({
      status: "approved",
      featured: true,
    }).limit(6);

    res.json(featured);
  } catch (error) {
    console.error("Get Featured Restaurants Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get single restaurant by slug
// GET /api/restaurants/:slug
export const getRestaurantBySlug = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      slug: req.params.slug,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    // If restaurant is not approved,
    // allow only admin or owner
    if (restaurant.status !== "approved") {
      let isAuthorized = false;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {
          const token = req.headers.authorization.split(" ")[1];

          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
          );

          const user = await User.findById(decoded.id);

          if (
            user &&
            (
              user.role === "admin" ||
              (user.role === "owner" &&
                restaurant.owner.toString() === user._id.toString())
            )
          ) {
            isAuthorized = true;
          }
        } catch (err) {
          // Ignore invalid token
        }
      }

      if (!isAuthorized) {
        return res.status(404).json({
          message: "Restaurant not found or pending approval",
        });
      }
    }

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

// Get restaurant availability
// GET /api/restaurants/:id/availability
export const getRestaurantAvailability = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Please provide a date",
      });
    }

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const bookingDate = new Date(date);

    // Get confirmed bookings
    const bookings = await Booking.find({
      restaurant: restaurant._id,
      date: bookingDate,
      status: "confirmed",
    });

    const availability = restaurant.availableSlots.map((slot) => {
      const bookedSeats = bookings
        .filter((b) => b.time === slot)
        .reduce((sum, b) => sum + b.guests, 0);

      const totalSeats = restaurant.totalSeats || 20;

      const availableSeats = Math.max(
        0,
        totalSeats - bookedSeats
      );

      return {
        time: slot,
        availableSeats,
        isAvailable: availableSeats > 0,
      };
    });

    res.json(availability);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};