const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientCtr");
const isAuth = require("../middleware/is-auth");

router.get("/products", isAuth, clientController.getProducts);
router.get("/detail/:productId", isAuth, clientController.getDetailProduct);
router.post("/add-to-cart", isAuth, clientController.postAddToCart);
router.get("/get-cart", isAuth, clientController.getCart);
router.post("/increment", isAuth, clientController.postIncrement);
router.post("/decrement", isAuth, clientController.postDecrement);
router.post("/remove-item", isAuth, clientController.postRemoveItem);
router.post("/checkout", isAuth, clientController.postCheckout);
router.get("/get-orders", isAuth, clientController.getOrders);
router.get("/orders/:id", isAuth, clientController.getBill);

module.exports = router;
