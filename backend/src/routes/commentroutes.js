import express from "express";
import {
  createComment,
  getCommentsForBook,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import auth from "../middleware/middleware.js";

const router = express.Router();

// CREATE
router.post("/:bookId", createComment);

// READ (with pagination + sort + filter + search)
router.get("/:bookId", getCommentsForBook);

// UPDATE
router.patch("/:id", updateComment);

// DELETE
router.delete("/:id", deleteComment);

export default router;
