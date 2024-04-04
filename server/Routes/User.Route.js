import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  signOut,
  test,
  updateUser,
} from "../controllers/User.Controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
router.get("/test", test);
router.post("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/getusers", verifyToken, getUsers);
router.get('/:userId',getUser)
router.delete("/deleteuser", verifyToken, deleteUser);
router.post("/signout", signOut);
export default router;
