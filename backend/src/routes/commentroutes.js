import express from "express";
import {
  createComment,
  getCommentsForBook,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import auth from "../middleware/middleware.js";

const router = express.Router();

router.post("/:bookId", auth, createComment);
router.get("/:bookId", auth, getCommentsForBook);
router.patch("/:id", auth, updateComment);
router.delete("/:id", auth, deleteComment);


export default router;
