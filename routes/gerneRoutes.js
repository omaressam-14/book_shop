const router = require("express").Router();
const gerneController = require("../controllers/gerneController");
const autController = require("../controllers/authController");

router.route("/").get(gerneController.getAllGerne);
router.route("/:id").get(gerneController.getGerne);

router.use(autController.protect, autController.restrictTo("admin"));
router.route("/").post(gerneController.createGerne);
router
  .route("/:id")
  .patch(gerneController.updateGerne)
  .delete(gerneController.deleteGerne);

module.exports = router;
