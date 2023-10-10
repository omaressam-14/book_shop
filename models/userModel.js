const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "you should specify name to user"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller", "author"],
      default: "user",
    },
    email: {
      type: String,
      required: [true, "please enter the email"],
      validate: [validator.isEmail, "please enter valid email"],
      unique: true,
    },
    photo: {
      type: String,
      default: "default.jpeg",
    },
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Book",
      },
    ],
    password: {
      type: String,
      minLength: [
        8,
        "the password is too short please enter at least 8 characters",
      ],
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return this.password === el;
        },
        message: "password and passwordConfirm is not matching",
      },
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  { timestamp: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password" || !this.isNew)) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = async function (iat) {
  if (!this.passwordChangedAt) return;
  const changeAt = Date.parse(this.passwordChangedAt) / 1000;
  return changeAt > iat;
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
