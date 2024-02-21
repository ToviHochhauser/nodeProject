import Joi from "joi";
import mongoose from "mongoose";
import  Jwt  from "jsonwebtoken";

const userSchema=mongoose.Schema({
    userName: String,
    password : String,
    email: String,
    role:{type:String,default: "READER"}

})
export const userModel=mongoose.model("users",userSchema);

export const validUser = (user) =>{
    const userValidation = Joi.object({
        userName:Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().email().required(),
    })
    return userValidation.validate(user);
}

//for when a user is loging in, not for first
export const validUserLogIn = (user) =>{
    const userValidation = Joi.object({
        userName:Joi.string(),
        password: Joi.string().required(),
        email: Joi.string().email().required(),
    })
    return userValidation.validate(user);
}

export const generateToken = (userName, _id, email, role) => {
    let token = Jwt.sign({ userName, _id, email, role }, process.env.JWT_SECRET || "secet-user-token", {
        expiresIn: "24h"
    })
    return token;
}
