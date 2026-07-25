const User = require('../models/User');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                res.status(401).json({ message: 'Not authorized, user not found' });
                return;
            }

            req.user = user;
            next();
        }
        catch (error) {
            console.error(`Auth Middleware error ${error}`);
            res.status(401).json({ message: "Not authorized, token failed" });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
        return;
    }
}

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        res.status(403).json({ message: "Access denied, admin role required" });
    }
}

const ownerOnly = (req, res, next) => {
    if (req.user && (req.user.role === "owner" || req.user.role === "admin")) {
        next();
    }
    else {
        res.status(403).json({ message: "Access denied, restaurant owner role required" });
    }
}

module.exports = {
    protect,
    adminOnly,
    ownerOnly
};