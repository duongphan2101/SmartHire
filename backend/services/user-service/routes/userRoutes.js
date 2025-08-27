const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail
} = require("../controllers/userController");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/emailfind/:email", getUserByEmail);
router.put("/:id", updateUser);
router.put("/avt/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
