const mongoose = require('mongoose');

const bookingschema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    place:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Place",
        required:true
    },
    checkIn:{
        type:Date,
        required:true
    },
    checkOut:{
        type:Date,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        default:0
    }
})

const BookingModel=mongoose.model("Booking",bookingschema)

module.exports=BookingModel;