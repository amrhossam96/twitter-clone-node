const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "like should be initiated by a user"],
    },
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tweet",
      required: [true, "like should be assigned to a tweet"],
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("like", likeSchema);
module.exports = Like;
