const express = require("express");
const authController = require("../controllers/authController");
const tweetsController = require("../controllers/tweetsController");

const router = express.Router();

router.use(authController.protect);
router
  .route("/")
  .get(tweetsController.getAllTweets)
  .post(tweetsController.createTweet);

router.get("/timeline", tweetsController.getTimeline);

router.route("/:id").get(tweetsController.getTweet);

router.get("/:id/likes", tweetsController.getTweetLikes);
router.get("/:id/retweets", tweetsController.getTweetRetweets);

router.post("/:id/like", tweetsController.makeLike);
router.post("/:id/dislike", tweetsController.makeDislike);

router.post("/:id/retweet", tweetsController.makeRetweet);
router.post("/:id/unretweet", tweetsController.makeUnRetweet);

module.exports = router;
