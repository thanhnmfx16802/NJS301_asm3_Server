const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: String,
          required: true,
        },
        img: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: { type: Number, required: true },
        totalPriceOfProduct: { type: Number, required: true },
      },
    ],
  },
  role: {
    type: String,
    enum: ["Admin", "Consultant", "Customer"],
    required: true,
  },
});

userSchema.methods.addItemToCart = function (product, quan) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId === product._id.toString();
  });

  let newQuantity;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + quan;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      img: product.img1,
      price: +product.price,
      quantity: quan,
      name: product.name,
      totalPriceOfProduct: product.price * quan,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.increment = function (product, quan, totalPriceOfProduct) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId === product._id.toString();
  });

  const updatedCartItems = [...this.cart.items];

  updatedCartItems[cartProductIndex].quantity = quan;
  updatedCartItems[cartProductIndex].totalPriceOfProduct = totalPriceOfProduct;

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.decrement = function (product, quan, totalPriceOfProduct) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId === product._id.toString();
  });

  const updatedCartItems = [...this.cart.items];

  updatedCartItems[cartProductIndex].quantity = quan;
  updatedCartItems[cartProductIndex].totalPriceOfProduct = totalPriceOfProduct;

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeItemFromCart = function (product) {
  const updatedCartItems = this.cart.items.filter((cp) => {
    return cp.productId !== product._id.toString();
  });

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
