import express from "express";
import {
  createComment,
  deleteComment,
  editcomment,
  getPostComments,
  getcomments,
  likeComment,
} from "../controllers/Comment.Controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getpostcomments/:postId", getPostComments);
router.put("/likecomment/:commentId", verifyToken, likeComment);
router.put("/editcomment/:commentId", verifyToken, editcomment);
router.delete("/deletecomment/:commentId", verifyToken, deleteComment);
router.get("/getcomments", getcomments);
export default router;
