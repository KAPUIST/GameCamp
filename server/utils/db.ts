import mongoose from "mongoose";
require("dotenv").config();

const db: string = process.env.DB_URL || "";

const connectDB = async () => {
  try {
    await mongoose.connect(db).then((data: any) => {
      console.log(`DB Connected host:${data.connection.host}`);
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
