import { connectToDb } from "./config/db.js";
import { config } from "dotenv";
import express from "express";
import bookRouter from "./routes/book.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js"
import { errorHandeler } from "./middleWares/errorHandeler.js";
import cors from "cors"
config();

const app = express();
app.use(express.json()); // <-- Add parentheses here
connectToDb();
//אני צריכה להוריד את הספריה
app.use(cors());

app.use(errorHandeler);
app.use("/api/books",bookRouter);
app.use("/api/user",userRouter);
app.use("/api/order",orderRouter);
let port = process.env.PORT || 4500;

app.listen(port, () => {
  console.log("App is listening on " + port);
});
