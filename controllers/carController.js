import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { Car } from '../models/carModel.js';

export const createCar = async (req, res) => {
    try {
        const { make, model, year, pricePerDay,fuelType,availability,seatingCapacity, engine,service, quality} = req.body;
     
        if(!req.file){
            return res.status(400).json({message:"image not visible"})
        }
               // Upload an image

               const uploadResult = await cloudinaryInstance.uploader.upload(req.file.path).catch((error)=>{
                console.log(error);
                
            })
             console.log(uploadResult);

             const newCar = new Car({ make, model, year, pricePerDay, fuelType,availability,seatingCapacity, engine,service, quality });

             if(uploadResult?.url){
                newCar.image = uploadResult.url;
             }
    
        if (!make || !model || !year || !pricePerDay || !fuelType|| !seatingCapacity|| !availability||!engine|| !service|| !quality) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        
        await newCar.save();

        res.status(201).json({ success: true, message: 'Car created successfully', data: newCar });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

export const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

export const getCarById = async (req, res) => {
    try {
        const { id } = req.params;

        const car = await Car.findById(id);
    
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        res.status(200).json({ success: true, data: car });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

export const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id || !updates) {
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }
  

        const car = await Car.findByIdAndUpdate(id, updates, { new: true }); 
//         const carExists = await Car.findById(id);
// console.log('Car Exists:', carExists);  
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        res.status(200).json({ success: true, message: 'Car updated successfully', data: car });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

export const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findByIdAndDelete(id);
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }

        res.status(200).json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
};

export const searchCars = async (req, res) => {
    try {
        console.log("Query Parameters:", req.query); // Log query params

        const { make } = req.query;

        if (!make) {
            return res.status(400).json({ success: false, message: "Make parameter is required" });
        }

        // Perform case-insensitive search for 'make'
        const cars = await Car.find({ make: new RegExp(make, 'i') });

        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

