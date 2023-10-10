const orderItemModel = require("../models/orderItem");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.createOrderItems = catchAsync(async (req, res, next) => {
  // we will create array contain all orderItems id's and pass it to order Controller
  let orderItemsIds = req.body.orderItems.map(async (orderItem) => {
    // create orderItem based on the data passed from the user
    let newOrderItem = await orderItemModel.create({
      quantity: orderItem.quantity,
      book: orderItem.book,
    });

    // return only the id of the orderItem to store it into orderItemsIds
    return newOrderItem._id;
  });

  // we need to excecute promises inside the orderitems ids and send it to request body
  const orderItems = await Promise.all(orderItemsIds);
  req.body.orderItems = orderItems;

  // calc the total price
  let prices = orderItems.map(async (id) => {
    return await orderItemModel.findById(id).populate({
      path: "book",
      select: "price",
    });
  });

  let totalPrice = await Promise.all(prices);
  let overallPrice = 0;
  totalPrice = totalPrice.map(
    (prod) => (overallPrice += prod.book.price * prod.quantity)
  );

  req.body.totalPrice = overallPrice;

  next();
});
