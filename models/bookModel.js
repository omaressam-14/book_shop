const mongoose = require("mongoose");
const slugify = require("slugify");

const bookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the book should have name"],
      trim: true,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "the book should have number"],
    },
    author: {
      type: mongoose.Types.ObjectId,
      required: [true, "the book should Belong to author"],
      ref: "Author",
    },
    description: {
      type: String,
      requried: [true, "the book should have description"],
      trim: true,
      default: "Book",
    },
    publication_date: Date,
    genre: {
      type: mongoose.Types.ObjectId,
      required: [true, " the book should belong to gerne"],
      ref: "Gerne",
    },
    quantity: {
      type: Number,
      required: [true, "you should specify a quantity for books"],
    },
    sold: {
      type: Number,
    },
    slug: {
      type: String,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10,
    },
  },
  { timestamp: true }
);

bookSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
