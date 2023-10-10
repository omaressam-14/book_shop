const handlerFactory = require("./handlerFactory");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.deleteUser = handlerFactory.deleteOne(userModel);
exports.getAllUsers = handlerFactory.getAll(userModel);
exports.getUser = handlerFactory.getOne(userModel);
exports.updateUser = handlerFactory.updateOne;
//
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password)
    return next(new AppError("to update password go to /updatePassword", 403));
  const user = await userModel.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
//
exports.createUser = (req, res, next) => {
  return next(
    new AppError("not allowed to create user here, go to /signUp", 403)
  );
};
