import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("DB Connected Succesfully");
    } catch (error) {
        console.error(error);
    }
}

export default connectDB;