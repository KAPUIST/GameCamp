import { app } from "./app";
import connectDB from "./utils/db";
import connectCloud from "./utils/image";
require("dotenv").config();

//create Server

app.listen(process.env.PORT, () => {
  console.log(`Server is connected PORT:${process.env.PORT}`);
  connectDB();
  connectCloud();
});
