const { catchAsync } = require("../utils/catchAsync");
const User = require("../models/userModel");
const Follow = require("../models/followModel");
const AppError = require("../utils/AppError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: users,
  });
});

module.exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined. use /signup instead",
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(new AppError("Frobidden request", 403));
  }
  const filteredBody = filterObj(req.body, "displayName", "email", "bio");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});

module.exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found associated with this id", 404));
  }
  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

module.exports.followUser = catchAsync(async (req, res, next) => {
  const currentUserID = req.user._id;
  const targetUserID = req.params.id;

  if (!currentUserID || !targetUserID) {
    return next(new AppError("Invalid user IDs", 400));
  }

  const follow = await Follow.findOne({
    follower: currentUserID,
    following: targetUserID,
  });

  if (follow) {
    return next(new AppError("Following relationship already exists", 400));
  }

  await Follow.create({
    follower: currentUserID,
    following: targetUserID,
  });

  await User.findByIdAndUpdate(
    currentUserID,
    { $inc: { followingCount: 1 } },
    { new: true }
  );

  await User.findByIdAndUpdate(
    targetUserID,
    { $inc: { followersCount: 1 } },
    { new: true }
  );

  return res.status(201).json({
    status: "success",
    message: `User ${targetUserID} was followed successfully`,
  });
});

module.exports.unfollowUser = catchAsync(async (req, res, next) => {
  const currentUserID = req.user._id;
  const targetUserID = req.params.id;

  if (!currentUserID || !targetUserID) {
    return next(new AppError("Invalid IDs", 400));
  }

  const followRelation = await Follow.findOne({
    follower: currentUserID,
    following: targetUserID,
  });

  if (!followRelation) {
    return next(new AppError("No following relation was found", 400));
  }

  await Follow.findOneAndDelete({
    follower: currentUserID,
    following: targetUserID,
  });

  await User.findByIdAndUpdate(
    currentUserID,
    { $inc: { followingCount: -1 } },
    { new: true }
  );

  await User.findByIdAndUpdate(
    targetUserID,
    { $inc: { followersCount: -1 } },
    { new: true }
  );

  return res.status(204).json({
    status: "success",
    message: "relation was deleted successfully",
  });
});
