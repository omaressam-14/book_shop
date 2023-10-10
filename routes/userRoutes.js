const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const router = require("express").Router();

//auth
router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);
router.post("/logout", authController.logout);
router.post("/forgetPassword", authController.forgetPassword);
router.post("/resetPassword/:token", authController.resetPassword);
router.post(
  "/updatePassword",
  authController.protect,
  authController.updateMyPassword
);

router.post("/updateMe", authController.protect, userController.updateMe);

// admin routes
router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
