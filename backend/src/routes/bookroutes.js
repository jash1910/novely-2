import express from "express";
import {
  searchGoogleBooks,
  saveBook,
  getBookById,
  getSavedBooks,
  updateBook,
  deleteBook
} from "../controllers/bookController.js";
import auth from "../middleware/middleware.js";

const router = express.Router();

// PUBLIC search
router.get("/search", searchGoogleBooks);

// PRIVATE BOOK ROUTES
router.get("/", auth, getSavedBooks);
router.post("/", auth, saveBook);
router.get("/:id", auth, getBookById);
router.patch("/:id", auth, updateBook);
router.delete("/:id", auth, deleteBook);

export default router;
