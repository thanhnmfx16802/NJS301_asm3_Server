const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getCurrentUsers = (req, res, next) => {
  User.find({ role: "Customer" })
    .countDocuments()
    .then((count) => {
      if (!count) {
        res.status(404).json({ count: 0 });
      }
      return res.status(200).json({ count: count });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// get all orders
exports.getCurrentTrans = (req, res, next) => {
  let numberOfOrder;

  Order.find()
    .countDocuments()
    .then((count) => {
      if (!count) {
        numberOfOrder = 0;
      }
      numberOfOrder = count;

      return Order.find();
    })

    .then((tran) => {
      if (!tran || tran.length === 0) {
        const error = new Error("No transaction available");
        error.statusCode = 404;
        throw error;
      }
      return res
        .status(200)
        .json({ transactions: tran, numberOfOrder: numberOfOrder });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// get order per page
exports.getCurrentPageTrans = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 8;

  Order.find()
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .then((tran) => {
      if (!tran || tran.length === 0) {
        const error = new Error("No transaction available");
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({ transactions: tran });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getAdBill = async (req, res, next) => {
  const id = req.params.id;
  try {
    const order = await Order.findOne({
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

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((prod) => {
      if (!prod) {
        const error = new Error("No product available");
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json(prod);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const _id = req.params.id;
  Order.findOne({ "products.productId": _id })
    .then((tran) => {
      if (tran) {
        const err = new Error("Product exist in other order");
        err.statusCode = 403;
        throw err;
      }
      return Product.findByIdAndDelete(_id);
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted Product!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTrans = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 9;
  let numberOfOrder;
  Order.find()
    .countDocuments()
    .then((count) => {
      if (!count) {
        numberOfOrder = 0;
      }
      numberOfOrder = count;

      return Order.find()

        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })

    .then((tran) => {
      if (!tran || tran.length === 0) {
        const error = new Error("No transaction available");
        error.statusCode = 404;
        throw error;
      }
      return res
        .status(200)
        .json({ transactions: tran, numberOfOrder: numberOfOrder });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// // Advanced

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findOne({ _id: productId })
    .then((prod) => {
      res.status(200).json(prod);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.putEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByIdAndUpdate(productId, { $set: req.body }, { new: true })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
