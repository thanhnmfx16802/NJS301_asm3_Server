const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.postSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const Phone = req.body.Phone;

  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      username: username,
      Phone: Phone,
      cart: { items: [] },
      role: "Customer",
    });

    const result = await user.save();

    res.status(201).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loaderUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    loaderUser = user;

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: loaderUser.email,
        userId: loaderUser._id.toString(),
        role: loaderUser.role,
      },
      "topsecret",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      userId: loaderUser._id.toString(),
      username: loaderUser.username,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postLoginAdmin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loaderUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Email or Password is incorrect!");
      error.statusCode = 404;
      throw error;
    }

    loaderUser = user;

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }

    if (isEqual && user.role === "Customer") {
      const err = new Error("Only Admin or Consultant account can access.");
      err.statusCode = 403;
      throw err;
    }

    const token = jwt.sign(
      {
        email: loaderUser.email,
        userId: loaderUser._id.toString(),
        role: loaderUser.role,
      },
      "topsecret",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      userId: loaderUser._id.toString(),
      username: loaderUser.username,
      role: loaderUser.role,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
