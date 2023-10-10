const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    cartItems: [
      {
        book: {
          type: mongoose.Types.ObjectId,
          ref: "Book",
        },

        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    discount: Number,
  },
  { timestamps: true }
);

// calc total price
cartSchema.post("save", async function () {
  let totalPrice = 0;
  this.cartItems.forEach((prod) => (totalPrice += prod.price * prod.quantity));
  this.totalPrice = totalPrice;
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
