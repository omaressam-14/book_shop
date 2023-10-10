const reviewModel = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.modifyUserBook = catchAsync(async (req, res, next) => {
  req.body.bookId = req.params.bookId;
  req.body.userId = req.user.id;

  next();
});

exports.createReview = handlerFactory.createOne(reviewModel);
exports.deleteReview = handlerFactory.deleteOne(reviewModel);
exports.updateReview = handlerFactory.updateOne(reviewModel);
exports.getReview = handlerFactory.getOne(reviewModel);
exports.getAllReviews = handlerFactory.getAll(reviewModel);
