const mongoose=require('mongoose');

const connectDB=async()=>{
  const mongoUri = process.env.MONGODB_URI || process.env.Mongo_Uri;
  if (!mongoUri) {
    throw new Error("MONGODB_URI must be configured before connecting to MongoDB");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully");
};

module.exports = connectDB;