const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    tweetContent: {
      type: String,
      trim: true,
      required: [true, "Tweet should have content!"],
      max: 140,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    parentTweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tweet",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    retweetsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Tweet = mongoose.model("tweet", tweetSchema);
module.exports = Tweet;
