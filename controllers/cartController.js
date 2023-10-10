const cartModel = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const bookModel = require("../models/bookModel");

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user.id });
  const { price } = await bookModel.findById(req.body.book).select("price");
  req.body.price = price;
  if (!cart) {
    let newCart = await cartModel.create({
      cartItems: [req.body],
      user: req.user.id,
    });

    res.status(200).json({
      status: "success",
      cart: newCart,
      message: "new cart has been created",
    });
  } else {
    const foundBook = cart.cartItems.find((el) => el.book == req.body.book);
    if (foundBook) {
      foundBook.quantity += 1;
    } else {
      cart.cartItems.push(req.body);
    }
    await cart.save();

    res.status(200).json({
      status: "success",
      cart: cart,
    });
  }
});

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user.id },
    { $pull: { cartItems: { _id: req.body.itemId } } }
  );
  if (!cart) return next(new AppError("there is no book found", 404));
  await cart.save();
  res.status(204).json({
    status: "success",
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user.id });
  if (!cart.cartItems)
    return next(new AppError("there is no cart for this user", 404));

  const book = cart.cartItems.find((prod) => prod.book == req.body.book);
  if (!book) return next(new AppError("no book found", 404));
  book.quantity = req.body.quantity;

  await cart.save();

  res.status(200).json({
    status: "success",
    cart: cart.cartItems,
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await cartModel
    .findOne({
      user: req.user.id,
    })
    .populate("cartItems.book");

  res.status(200).json({
    status: "success",
    cart: cart,
  });
});
