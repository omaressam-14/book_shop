const router = require("express").Router();
const wishlistController = require("../controllers/wishlistController");
const authController = require("../controllers/authController");

router.use(authController.protect, authController.restrictTo("user"));

router
  .route("/")
  .patch(wishlistController.addToWishlist)
  .delete(wishlistController.deleteFromWishlist)
  .get(wishlistController.getWishlist);

module.exports = router;
