import express from "express";
import {
    getAllCommentsForBook,
    addCommentToBook,
    getAllChaptersForBook,
    addChapterToBook,
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
} from "../controller/book.js";
import { authForAuthors,authForAuthorChanges,authForManager,auth } from "../middleWares/auth.js";
const router = express.Router();

router.get("/:bookId/comments", getAllCommentsForBook); 
router.post("/:bookId/comments",auth, addCommentToBook); 

router.get("/:bookId/chapters", getAllChaptersForBook); 
router.post("/:bookId/chapters",authForAuthorChanges, addChapterToBook); 

// GET all books
router.get("/", getAllBooks);

// GET a single book by ID
router.get("/:id", getBookById);

// POST a new book
router.post("/",auth,authForAuthors, addBook);

// PUT update a book by ID
router.put("/:id",auth,authForAuthorChanges, updateBook);

// DELETE a book by ID
router.delete("/:id",auth,authForAuthorChanges, deleteBook);

export default router;
