const router = require("express").Router();
const bookController = require("../controllers/bookController");
const authController = require("../controllers/authController");
const reviewRoutes = require("../routes/reviewRoutes");

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(bookController.createBook);

router
  .route("/:id")
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

router.use("/:bookId/reviews", reviewRoutes);

module.exports = router;
