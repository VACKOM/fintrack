import mongoose from "mongoose";

const dbConnect = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.log("MONGO_URI has not been registered in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDb successfully connected.....");
  } catch (error) {
    console.log(`MongoDb connection failed ${error.message}`);
    process.exit(1);
  }
};
export default dbConnect;
