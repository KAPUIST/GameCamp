import { app } from "./app";
import connectDB from "./utils/db";
require("dotenv").config();

//create Server

app.listen(process.env.PORT, () => {
  console.log(`Server is connected PORT:${process.env.PORT}`);
  connectDB();
});
