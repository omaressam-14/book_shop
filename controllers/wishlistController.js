const catchAsync = require("../utils/catchAsync");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const { wishlist } = await userModel
    .findByIdAndUpdate(
      id,
      {
        $addToSet: { wishlist: req.body.book },
      },
      {
        new: true,
        runValidators: true,
      }
    )
    .populate("wishlist");

  if (!wishlist) return next(new AppError("no wishlist found", 404));

  res.status(200).json({
    status: "success",
    data: {
      wishlist,
    },
  });
});

exports.deleteFromWishlist = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const { wishlist } = await userModel
    .findByIdAndUpdate(
      id,
      { $pull: { wishlist: req.body.book } },
      { new: true }
    )
    .populate("wishlist");

  if (!wishlist) return next(new AppError("there is no wishlist found", 404));

  res.status(204).json({
    status: "success",
    data: {
      wishlist,
    },
  });
});

exports.getWishlist = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const { wishlist } = await userModel.findById(id).populate("wishlist");

  if (!wishlist) return next(new AppError("wishlist not found"));

  res.status(200).json({
    status: "success",
    items: wishlist.length,
    data: {
      wishlist,
    },
  });
});
