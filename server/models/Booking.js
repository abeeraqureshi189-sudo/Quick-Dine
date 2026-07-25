const mongoose = require('mongoose');
const crypto = require('crypto');

const BookingSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    restaurant : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'Restaurant'
    },
    date : {
        type : Date,
        required : true
    },
    time : {
        type : String,
        required : true,
    },
    guests : {
        type : Number,
        required: true,
        min: 1
    },
    occasion: {
        type: String,
        trim: true
    },
    specialRequests: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    },
    bookingId: {
        type: String,
        unique: true
    }
},
{
    timestamps : true
}
);

BookingSchema.pre("save", function(){
    if(!this.bookingId) {
        this.bookingId = `GR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
    }
});

module.exports = mongoose.model("Booking", BookingSchema);