const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const gerneSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "you should provide name to gerne"],
      trim: true,
      unique: true,
    },
    books: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Book",
      },
    ],
    slug: String,
    description: String,
  },
  { timestamp }
);

gerneSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

const Gerne = mongoose.model("Gerne", gerneSchema);
module.exports = Gerne;
