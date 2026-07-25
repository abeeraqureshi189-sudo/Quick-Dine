require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
const restaurantRouter = require('./routes/restaurantRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const ownerRouter = require('./routes/ownerRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Server is Live!");
});

app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/admin', adminRouter);

app.use((error, req, res, next) => {
    console.error(`Unhandled Error ${error}`);
    res.status(500).json({
        message : error.message || "Internal Server Error",
        stack : process.env.NODE_ENV === 'production' ? undefined : error.stack
    })
})

const startServer = async () => {
    try{
        await connectDB();
    }
    catch(error) {
        console.error("Database connection failed", error);
    }
}

startServer();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});