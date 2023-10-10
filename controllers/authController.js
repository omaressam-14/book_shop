const catchAsync = require("../utils/catchAsync");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const Email = require("../utils/email");
const crypto = require("crypto");

//
const sendToken = async (user, payload, res, statusCode) => {
  const token = jwt.sign({ id: payload }, process.env.SECRET_KEY);

  res.cookie("jwt", token, {
    maxAge:
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token: token,
    data: {
      user,
    },
  });
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.signUp = catchAsync(async (req, res, next) => {
  const d = filterObj(req.body, "name", "email", "password", "passwordConfirm");
  const user = await userModel.create(d);

  sendToken(user, user._id, res, 200);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const user = await userModel
    .findOne({ email: req.body.email })
    .select("+password");
  //
  if (
    !user ||
    !(await user.correctPassword(req.body.password, user.password))
  ) {
    return next(new AppError("wrong email or password", 401));
  }
  //
  sendToken(user, user._id, res, 200);
});

exports.logOut = catchAsync(async (req, res, next) => {});

exports.protect = catchAsync(async (req, res, next) => {
  // check if the token is there
  const header = req.headers.authorization;
  if (!header)
    return next(new AppError("No Token Found, Please Log in Again", 401));
  if (!header.startsWith("Bearer"))
    return next(new AppError("No Token Found, Please Log in Again", 401));
  // verify the token
  const verifyToken = jwt.verify(header.split(" ")[1], process.env.SECRET_KEY);
  if (!verifyToken)
    return next(new AppError("invalid token, please login again", 401));
  // check if the user still exsist
  const user = await userModel.findById(verifyToken.id);
  if (!user)
    return next(new AppError("Invalid Token, please login again", 401));
  // check if the user change the pass after init
  user.changePasswordAfter(verifyToken.iat);

  // send user data to req
  req.user = user;
  next();
});

exports.restrictTo = function (...roles) {
  return catchAsync(async (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role))
      return next(new AppError("You Are Not Authorized", 401));

    return next();
  });
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("we could not find user with this email", 400));

  const resetToken = user.createPasswordResetToken();
  user.save({ validateBeforeSave: false });

  // send email
  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${resetToken}`;
  console.log(url);

  const e = new Email(user, url);
  await e.sendPasswordReset();

  res.status(200).json({
    status: "success",
    message: "reset email has been sent",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel
    .findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gte: Date.now() },
    })
    .select("+password");

  //
  if (!user)
    return next(
      new AppError("Your reset token invalid or expired, try again", 401)
    );

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  sendToken({ message: "the password successfully reset" }, user.id, res, 200);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError("your entered exsisting password is wrong", 401));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  res.status(200).json({ status: "success" });
});
