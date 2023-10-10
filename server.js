process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION, ...Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("server is running");
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION, ...Shutting down..");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
