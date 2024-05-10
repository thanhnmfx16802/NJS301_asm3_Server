const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");
const MailTemplate = require("../utils/mailTemplate");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "thanhit486@gmail.com",
    pass: "zwmwcbsdusgmfxgx",
  },
});

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((prod) => {
      if (!prod || prod.length === 0) {
        const error = new Error("No have product!");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json(prod);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};

exports.getDetailProduct = (req, res, next) => {
  const productId = req.params.productId;
  let product;
  Product.findOne({ _id: productId })
    .then((prod) => {
      product = prod;
      return Product.find();
    })
    .then((products) => {
      const relatedProd = products.filter(
        (prod) => prod.category === product.category && prod._id !== product._id
      );
      res.status(200).json({ selectProd: product, relatedProd: relatedProd });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
        next(err);
      }
    });
};

exports.postAddToCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const quantity = req.body.quantity;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      const error = new Error("No have product.");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user found.");
      error.statusCode = 404;
      throw error;
    }

    const result = await user.addItemToCart(product, quantity);

    return res.status(200).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("No user found.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(user.cart.items);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.postIncrement = async (req, res, next) => {
  const prodId = req.body.productId;
  const quantity = req.body.quantity;
  const totalPriceOfProduct = req.body.totalPriceOfProduct;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      const error = new Error("No have product.");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user found.");
      error.statusCode = 404;
      throw error;
    }

    const result = await user.increment(product, quantity, totalPriceOfProduct);

    return res.status(200).json(result.cart.items);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.postDecrement = async (req, res, next) => {
  const prodId = req.body.productId;
  const quantity = req.body.quantity;
  const totalPriceOfProduct = req.body.totalPriceOfProduct;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      const error = new Error("No have product.");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user found.");
      error.statusCode = 404;
      throw error;
    }

    const result = await user.decrement(product, quantity, totalPriceOfProduct);

    return res.status(200).json(result.cart.items);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.postRemoveItem = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    if (!product) {
      const error = new Error("No have product.");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user found.");
      error.statusCode = 404;
      throw error;
    }

    const result = await user.removeItemFromCart(product);

    return res.status(200).json(result.cart.items);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.postCheckout = async (req, res, next) => {
  const email = req.body.email;
  const fullname = req.body.fullname;
  const phone = req.body.phone;
  const address = req.body.address;
  const totalPrice = req.body.totalPrice;
  const cartItems = req.body.cartItems;

  try {
    const order = new Order({
      userId: req.userId,
      fullname: fullname,
      email: email,
      phone: phone,
      address: address,
      totalPrice: totalPrice,
      products: req.body.products,
      delivery: req.body.delivery,
      status: req.body.status,
      createdAt: new Date(),
    });

    await order.save();
    const user = await User.findById(req.userId);
    const result = await user.clearCart();

    res.status(201).json(result);

    return transporter.sendMail({
      to: email,
      from: "shop@ecommerce-app.com",
      subject: "Successfully Checkout.",
      html: MailTemplate(fullname, phone, address, cartItems, totalPrice),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId });

    if (!orders) {
      const error = new Error("No have order.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(orders);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.getBill = async (req, res, next) => {
  const id = req.params.id;
  try {
    const order = await Order.findOne({
      userId: req.userId,
      _id: id,
    }).populate("products.productId");

    if (!order) {
      const error = new Error("No have order infomation.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(order);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};
