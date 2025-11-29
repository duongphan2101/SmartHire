const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getAllHR,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  addJobToLiked,
  removeJobFromLiked,
  addJobToApplyted,
  banUser,
  unbanUser,
  getBannedUsersCount,
} = require("../controllers/userController");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/hr/all", getAllHR);
router.get("/:id", getUserById);
router.get("/emailfind/:email", getUserByEmail);
router.get("/banned/count", getBannedUsersCount);
router.put("/:id", updateUser);
router.put("/avt/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/save", addJobToLiked);
router.post("/unsave", removeJobFromLiked);
router.post("/apply", addJobToApplyted);
router.put("/ban/:id", banUser);
router.put("/unban/:id", unbanUser);

module.exports = router;
