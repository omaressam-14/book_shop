const mongoose = require("mongoose");
const bookModel = require("./bookModel");
const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "The Review Should Have Text"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "please provide rating to your review"],
      min: [1, "minimum rating should be above one"],
      max: [5, "maximum rating should be below than 5"],
    },
    bookId: {
      type: mongoose.Types.ObjectId,
      required: [true, "the review should belong to book"],
      ref: "Book",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: [true, "the review should belong to user"],
      ref: "User",
    },
  },
  { timestamp: true }
);

reviewSchema.index({ userId: 1 }, { bookId: 1 }, { unique: true });

reviewSchema.statics.calcRatingAvg = async function (bkId) {
  const stats = await this.aggregate([
    {
      $match: { bookId: bkId },
    },
    {
      $group: {
        _id: "$bookId",
        nRating: { $sum: 1 },
        ratingAvg: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await bookModel.findByIdAndUpdate(bkId, {
      ratingsAverage: stats[0].ratingAvg,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await bookModel.findByIdAndUpdate(bkId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcRatingAvg(this.bookId);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  const docc = await this.model.findOne(this.getQuery());
  this.curDoc = docc;
  this.bkId = docc.bookId;
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.curDoc.constructor.calcRatingAvg(this.bkId);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
