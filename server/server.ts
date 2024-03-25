import { app } from "./app";
import connectDB from "./utils/db";
import connectCloud from "./utils/image";
require("dotenv").config();

//create Server
//에러처리 필요?
app.listen(process.env.PORT, () => {
  connectDB();
  connectCloud();
  console.log(`Server is connected PORT:${process.env.PORT}`);
});
