import Joi from "joi";
import mongoose from "mongoose";

const chapterSchema = mongoose.Schema({
    title: String,
    content: String
});

const commentSchema = mongoose.Schema({
    user: String,
    text: String,
    postDate: {type:Date,default:Date.now}
});
const authorSchema = mongoose.Schema({
    name: String,
    email: String,
    books:[String]
});

const bookSchema = mongoose.Schema({
    name: String,
    pages: Number,
    author:authorSchema,
    description: String,
    picUrl: String,
    postDate: {type:Date,default:Date.now},
    chapters: [chapterSchema],
    comments: [commentSchema]
});

export const bookModel = mongoose.model("books", bookSchema);
//אני יוצרת את הבדיקה של הספר. את הסופר ותאריך עליית הספר וההערה, מקבלים אוטומטית
export const bookValidation = (book) => {
    const bookJoi = Joi.object({
        name: Joi.string().min(2).required(),
        pages: Joi.number().min(20).required(),
        description: Joi.string().min(2),
        picUrl: Joi.string(),
        chapters: Joi.array().items(Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required()
        })),
        comments: Joi.array().items(Joi.object({
            user: Joi.string().required(),
            text: Joi.string().min(20).required()
        }))
    });
    return bookJoi.validate(book);
};
