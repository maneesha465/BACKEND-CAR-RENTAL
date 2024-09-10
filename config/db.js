import mongoose from "mongoose";
export const connectDB = async () => {
   try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('database added successfully');
    
   } catch (error) {
    console.log(error);
    
   }
}