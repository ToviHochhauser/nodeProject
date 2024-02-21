import mongoose from "mongoose";
import { bookModel, bookValidation } from "../models/book.js";


export const getAllBooks = async (req, res) => {
    const { txt = "", page = 1, perPage = 10 } = req.query;
    try {
        const booksArr = await bookModel.find({ name: new RegExp(txt) })
            .skip(((page) - 1) * (perPage)).limit((perPage));
        res.json(booksArr);
    } catch (err) {
        res.status(500).json(err);
    }
};


export const getBookById = async (req, res) => {
    const id = req.params.id;

    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).send("Invalid ID");

        const book = await bookModel.findById(id);
        if (!book)
            return res.status(404).send("Book not found");

        res.json(book);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const addBook = async (req, res) => {
    const { name } = req.body;
    const { userName, email } = req.user;
    const validation = bookValidation(req.body);

    if (validation.error)
        return res.status(400).send(validation.error.details[0].message);

    try {
        const existingBook = await bookModel.findOne({ name });
        if (existingBook)
            return res.status(409).send("A book with this name already exists");

        const newBook = new bookModel({
            ...req.body,
            //מכניסה לסופר נתונים
            //שם הספר שנכנס למערך נכנס בתור אלמנט אחרון, 
            // אם הוא ראשון הוא מאתחל את המערך עם עצמו
            author: { name: userName, email, books: [name] }
        });
        await newBook.save();

        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const deleteBook = async (req, res, role) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).send("Invalid ID");

    try {
        const bookForDelete = await bookModel.findById(id);
        if (!bookForDelete)
            return res.status(404).send("Book not found");

        const deletedBook = await bookModel.findByIdAndDelete(id);
        res.json(deletedBook);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const updateBook = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).send("Invalid ID");

    try {
        const bookForUpdate = await bookModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!bookForUpdate)
            return res.status(404).send("Book not found");

        res.json(bookForUpdate);
    } catch (err) {
        console.error("Error updating book:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const getAllCommentsForBook = async (req, res) => {
    const bookId = req.params.bookId;
    try {
        const book = await bookModel.findById(bookId);
        if (!book)
            return res.status(404).send("Book not found");

        res.json(book.comments);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const addCommentToBook = async (req, res) => {
    const bookId = req.params.bookId;
    const { text } = req.body;
    let name = req.user.userName;
    try {
        const book = await bookModel.findById(bookId);
        if (!book)
            return res.status(404).send("Book not found");

        const newComment = {name , text };
        book.comments.push(newComment);
        await book.save();

        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getAllChaptersForBook = async (req, res) => {
    const bookId = req.params.bookId;
    try {
        const book = await bookModel.findById(bookId);
        if (!book)
            return res.status(404).send("Book not found");

        res.json(book.chapters);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const addChapterToBook = async (req, res) => {
    const bookId = req.params.bookId;
    const { title, content } = req.body;

    try {
        const book = await bookModel.findById(bookId);
        if (!book)
            return res.status(404).send("Book not found");

        const newChapter = { title, content };
        book.chapters.push(newChapter);
        await book.save();

        res.status(201).json(newChapter);
    } catch (err) {
        res.status(500).json(err);
    }
};
export const updateChapter = async (req, res) => {
    const bookId = req.params.bookId;
    const chapterId = req.params.chapterId;
    const { title, content } = req.body;

    try {
        const book = await bookModel.findById(bookId);
        if (!book)
            return res.status(404).send("Book wasn`t found");

        const chapterIndex = book.chapters.findIndex(chapter => chapter._id == chapterId);
        if (chapterIndex === -1)
            return res.status(404).send("Chapter was not found");

        book.chapters[chapterIndex].title = title;
        book.chapters[chapterIndex].content = content;
        await book.save();

        res.json(book.chapters[chapterIndex]);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const deleteChapter = async (req, res) => {
    const bookId = req.params.bookId;
    const chapterId = req.params.chapterId;

    try {
        const book = await bookModel.findById(bookId);
        if (!book)
            return res.status(404).send("Book not found");

        const chapterIndex = book.chapters.findIndex(chapter => chapter._id == chapterId);
        if (chapterIndex === -1)
            return res.status(404).send("Chapter not found");

        const deletedChapter = book.chapters.splice(chapterIndex, 1);
        await book.save();

        res.json(deletedChapter);
    } catch (err) {
        res.status(500).json(err);
    }
};

