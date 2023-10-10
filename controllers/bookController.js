const bookModel = require("../models/bookModel");
const handlerFactory = require("./handlerFactory");

exports.createBook = handlerFactory.createOne(bookModel);
exports.deleteBook = handlerFactory.deleteOne(bookModel);
exports.updateBook = handlerFactory.updateOne(bookModel);
exports.getBook = handlerFactory.getOne(bookModel);
exports.getAllBooks = handlerFactory.getAll(bookModel);
