const { catchAsync } = require("../utils/catchAsync");
const Tweet = require("../models/tweetModel");
const Like = require("../models/likeModel");
const Retweet = require("../models/retweetModel");
const Follow = require("../models/followModel");
const AppError = require("../utils/AppError");

module.exports.getAllTweets = catchAsync(async (req, res, next) => {
  const tweets = await Tweet.find({ user: req.user._id }).limit(25);
  res.status(200).json({
    status: "success",
    data: {
      tweets,
    },
  });
});

module.exports.createTweet = catchAsync(async (req, res, next) => {
  const tweetContent = req.body.tweetContent;
  if (!tweetContent) {
    return next(new AppError("A Tweet must have content"));
  }
  const tweet = await Tweet.create({
    tweetContent,
    user: req.user,
  });
  res.status(201).json({
    status: "success",
    data: {
      tweet,
    },
  });
});

module.exports.getTweet = catchAsync(async (req, res, next) => {
  const tweet = await Tweet.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      tweet,
    },
  });
});

module.exports.getTweetLikes = catchAsync(async (req, res, next) => {
  const likes = await Like.find({ tweet: req.params.id });
  res.status(200).json({
    status: "success",
    data: {
      likes,
    },
  });
});

module.exports.getTweetRetweets = catchAsync(async (req, res, next) => {
  const retweets = await Retweet.find({ tweet: req.params.id });
  res.status(200).json({
    status: "success",
    data: {
      retweets,
    },
  });
});

module.exports.makeLike = catchAsync(async (req, res, next) => {
  const existingLike = await Like.findOne({
    user: req.user._id,
    tweet: req.params.id,
  });

  if (existingLike) {
    return next(
      new AppError("User already has a like associated with this tweet")
    );
  }

  await Like.create({
    user: req.user._id,
    tweet: req.params.id,
  });

  const tweet = await Tweet.findByIdAndUpdate(
    req.params.id,
    { $inc: { likesCount: 1 } },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    data: {
      tweet,
    },
  });
});

module.exports.makeDislike = catchAsync(async (req, res, next) => {
  const existingLike = await Like.findOne({
    tweet: req.params.id,
    user: req.user._id,
  });

  if (!existingLike) {
    return next(new AppError("User has no like associated with this tweet"));
  }

  await Like.deleteOne({
    tweet: req.params.id,
    user: req.user._id,
  });

  await Tweet.findByIdAndUpdate(req.params.id, { $inc: { likesCount: -1 } });

  return res.status(204).json({
    status: "success",
    message: "unliked tweet successfully!",
  });
});

module.exports.makeRetweet = catchAsync(async (req, res, next) => {
  await Retweet.create({
    user: req.user._id,
    tweet: req.params.id,
  });

  const tweet = await Tweet.findByIdAndUpdate(
    req.params.id,
    { $inc: { retweetsCount: 1 } },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    data: {
      tweet,
    },
  });
});

module.exports.makeUnRetweet = catchAsync(async (req, res, next) => {
  const existingRetweet = await Retweet.findOneAndDelete({
    user: req.user._id,
    tweet: req.params.id,
  });

  if (!existingRetweet) {
    return next(new AppError("User has not retweeted this tweet", 404));
  }

  await Tweet.findByIdAndUpdate(
    req.params.id,
    { $inc: { retweetsCount: -1 } },
    { new: true }
  );

  res.status(204).json({
    status: "success",
    message: "Unretweeted tweet successfully!",
  });
});

module.exports.getTimeline = catchAsync(async (req, res, next) => {
  const followings = await Follow.find({ follower: req.user._id });
  const followingIDs = followings.map((el) => el.following);
  const followingListTweets = await Tweet.find({
    user: { $in: followingIDs },
  }).populate("user");
  return res.status(200).json({
    status: "success",
    data: {
      followingListTweets,
    },
  });
});
