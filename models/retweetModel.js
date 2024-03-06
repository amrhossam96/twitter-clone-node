const mongoose = require("mongoose");

const retweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Retweet should be initiaed by a user"],
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tweet",
      required: [true, "Retweet should be assigned to a tweet"],
    },
  },
  {
    timestamps: true,
  }
);

const Tweet = mongoose.model("retweet", retweetSchema);
module.exports = Tweet;
