const authorModel = require("../models/authorModel");
const handlerFactory = require("./handlerFactory");

exports.createAuthor = handlerFactory.createOne(authorModel);
exports.deleteAuthor = handlerFactory.deleteOne(authorModel);
exports.updateAuthor = handlerFactory.updateOne(authorModel);
exports.getAuthor = handlerFactory.getOne(authorModel);
exports.getAllAuthor = handlerFactory.getAll(authorModel);
