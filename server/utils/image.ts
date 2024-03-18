import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();
const connectCloud = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
  });
};

export default connectCloud;
