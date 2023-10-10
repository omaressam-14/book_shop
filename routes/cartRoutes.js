const router = require("express").Router();
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.protect, cartController.getCart)
  .put(authController.protect, cartController.addProductToCart)
  .patch(authController.protect, cartController.updateItem)
  .delete(authController.protect, cartController.removeItemFromCart);

module.exports = router;
