const router = require("express").Router();
const authorController = require("../controllers/authorController");

router
  .route("/")
  .get(authorController.getAllAuthor)
  .post(authorController.createAuthor);

router
  .route("/:id")
  .get(authorController.getAuthor)
  .patch(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

module.exports = router;
