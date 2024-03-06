const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.patch("/updateMe", authController.protect, userController.updateMe);

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);

router.get("/:id", userController.getUser);

router.post("/:id/follow", authController.protect, userController.followUser);
router.post(
  "/:id/unfollow",
  authController.protect,
  userController.unfollowUser
);

module.exports = router;
