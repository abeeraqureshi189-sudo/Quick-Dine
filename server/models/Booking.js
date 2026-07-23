import {Document, Schema, model , types} from "mongoose";
import crypto from "crypto";

export interface IBooking extends Document{
    user: types.ObjectId;
    restaurant: types.ObjectId;
    date: Date;
    time: String;
    guests: Number;
    occasion?: String;
    specialRequests?: String;
    status: "confirmed" | "canceled" | "completed";
    bookingId: String;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        user : {type: Schema.Types.ObjectId, ref: "User", required: true },
        restaurant : {type: Schema.Types.ObjectId, ref: "Restaurant", required: true  },
        date: {type: Date, required: true},
        time: {type: String, required: true},
        guests: {type: Number, required: true, min:1},
        occasion: {type: String, trim: true},
        specialRequests: {type: String, trim: true},
        status: {type: String, enum: ["confirmed", "cancelled", "completed"], default: "confirmed"},
        bookingId: {type: String, unique: true},
    },
    {timestamps: true}

)
//auto generate referance code on save
BookingSchema.pre("save", function() {
    if(!this.bookingId){
        this. bookingId 'GR-${crypto.randomBytes(4).toString("hex).toUpperCase}'
    }
})


export const Booking = model("Booking", BookingSchema);