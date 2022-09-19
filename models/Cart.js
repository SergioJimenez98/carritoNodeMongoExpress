const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
        type: String,
        required: true
    },
    products: [
      {
        productId: Number,
        quantity: Number,
        name: String,
        price: Number
      }
    ],
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
