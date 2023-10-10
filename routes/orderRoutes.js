const router = require("express").Router();
const orderController = require("../controllers/orderController");
const orderItemController = require("../controllers/orderItemController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(orderController.getOrderList)
  .post(
    orderItemController.createOrderItems,
    orderController.addUser,
    orderController.createOrder
  );

router
  .route("/:id")
  .get(orderController.getOrderById)
  .patch(authController.restrictTo("admin"), orderController.updateOrderStatus)
  .delete(orderController.deleteOrder);

router.use(authController.protect, authController.restrictTo("admin"));
router.get("/allOrders", orderController.getAllOrders);

module.exports = router;
