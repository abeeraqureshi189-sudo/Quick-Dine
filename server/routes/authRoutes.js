const express = require('express');
const {generateUser, loginUser, getMe} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const authRouter = express.Router();

authRouter.post('/register', generateUser);
authRouter.post('/login', loginUser);
authRouter.get('/me', protect, getMe);

module.exports = authRouter;