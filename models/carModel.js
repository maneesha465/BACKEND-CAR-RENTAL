import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    fuelType:{
        type:String,
        required: true
    },
    image: {
        type: String,
        default: 'default-car-image-url'
    },
    seatingCapacity:{
     type:String,
     required: true
    },
   engine:{
        type:String,
        required: true
       },
      service:{
        type:String,
        required: true
       },
       quality:{
        type:String,
        required: true
       },
    availability : {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const Car = mongoose.model('Car', carSchema);
