const router = require("express").Router({ mergeParams: true });
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.modifyUserBook,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

module.exports = router;
