const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authCtr");

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password", "Password has to be valid.")
      .isLength({ min: 8 })
      .isAlphanumeric(),
    body("username", "name must be more than 3 chars.").isLength({ min: 3 }),
    body("Phone", "Phone must not be empty")
      .isLength({ min: 1 })
      .isAlphanumeric(),
  ],
  authController.postSignup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password", "Password has to be valid.")
      .isLength({ min: 8 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.post(
  "/login-admin",
  [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password", "Password has to be valid.")
      .isLength({ min: 8 })
      .isAlphanumeric(),
  ],
  authController.postLoginAdmin
);

module.exports = router;
