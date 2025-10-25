import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (errors) {
        console.error("❌ Database connection error:", errors);
        process.exit(1);
    }
}

export default connectDB;