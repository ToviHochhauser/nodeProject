import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { bookModel } from "../models/book.js";
export const auth = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).send("no authorization")
    try {
        let user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch (err) {
        console.log('Token verification error:', err.message);
        return res.status(401).send("not a valid token")
    }
}
export const authForAuthors = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).send("no authorization")
    try {
        let user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        if (user.role != "author" && user.role != "admin")
            return res.status(403).send("you have no authorization for this")

        next();
    }
    catch {
        return res.status(401).send("not a valid token")
    }
}
export const authForManager = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).send("no authorization")
    try {
        let user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        if (user.role != "admin")
            return res.status(403).send("you have no authorization for this")

        next();
    }
    catch {
        return res.status(401).send("not a valid token")
    }
}
export const authForAuthorChanges = async (req, res, next) => {
    // Check if req.user and req.body.author are defined
    // if (!req.user || !req.body.author || !req.user.email || !req.body.author.email) {
    //     return res.status(400).send("Invalid request: Missing user or author data");
    // }
    const id = req.params.id;
    // if (!mongoose.isValidObjectId(id))
    //     return res.status(400).send("Invalid ID");
    let userEmail;
    let bookAuthorEmail;
    
    const book = await bookModel.findById(id);
    if (!book) {
        return res.status(404).send("Book not found"); // Respond with 404 Not Found status
    }
    req.author = book.author;
    userEmail = req.user.email; // Get the email of the authenticated user from the token
    bookAuthorEmail = req.author.email; // Get the email of the author of the book from the request body


    // Compare the emails
    if (userEmail !== bookAuthorEmail) {
        return res.status(403).send("You are not authorized to perform this action");
    }

    next();
};


