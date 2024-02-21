import mongoose from "mongoose";

export const connectToDb=()=>{
let uri = process.env.DB_URI || "mongodb://0.0.0.0:27017/booktel";
mongoose.connect(uri)
.then(success=>{
    console.log("managed to connect to db successfully");
})
.catch(err=>{
    console.log("couldn`t connect to db");
    console.log(err);
    process.exit(1);
})
}