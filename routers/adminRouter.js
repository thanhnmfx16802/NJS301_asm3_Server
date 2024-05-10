const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminCtr");
const isAuth = require("../middleware/is-auth");

router.get("/current-users", isAuth, adminController.getCurrentUsers);
router.get("/current-trans", isAuth, adminController.getCurrentTrans);
router.get("/current-page-trans", isAuth, adminController.getCurrentPageTrans);
router.get("/orders/:id", isAuth, adminController.getAdBill);
router.get("/products", isAuth, adminController.getProducts);
router.post("/delete-product/:id", isAuth, adminController.deleteProduct);

router.get("/trans", isAuth, adminController.getTrans);

router.get("/edit/:productId", isAuth, adminController.getEditProduct);
router.put("/edit/:productId", isAuth, adminController.putEditProduct);

module.exports = router;
