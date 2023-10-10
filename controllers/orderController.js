const orderModel = require("../models/orderModel");
const orderItemModel = require("../models/orderItem");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.addUser = catchAsync(async (req, res, next) => {
  req.body.user = req.user;

  next();
});

exports.getAllOrders = handlerFactory.getAll(orderModel);

exports.getOrderList = catchAsync(async (req, res, next) => {
  const orderList = await orderModel
    .find({ user: req.user.id })
    .populate({
      path: "orderItems",
      populate: {
        path: "book",
      },
    })
    .populate({
      path: "user",
      select: "name email",
    })
    .sort({ dateOrdered: -1 });

  if (!orderList)
    return next(new AppError("there is no order for this user", 404));

  res.status(200).json({
    status: "success",
    resutls: orderList.length,
    data: {
      orderList,
    },
  });
});

exports.createOrder = handlerFactory.createOne(orderModel);

exports.getOrderById = handlerFactory.getOne(orderModel);

exports.deleteOrder = catchAsync(async (req, res, next) => {
  //get the order
  const order = await orderModel.findById(req.params.id);

  if (!order) return next(new AppError("there is no order found", 404));

  // remove all orderItems in that order
  order.orderItems.forEach(async (orderItem) => {
    await orderItemModel.findByIdAndDelete(orderItem);
  });

  // remove the order it self
  await orderModel.findByIdAndDelete(order._id);

  res.status(204).json({
    status: "success",
    message: "removed",
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await orderModel.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return next(new AppError("there is no order found", 404));

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
