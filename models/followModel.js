const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const followModel = mongoose.model("follow", followSchema);
module.exports = followModel;
