const gerneModel = require("../models/gerneModel");
const handlerFactory = require("./handlerFactory");

exports.createGerne = handlerFactory.createOne(gerneModel);
exports.deleteGerne = handlerFactory.deleteOne(gerneModel);
exports.updateGerne = handlerFactory.updateOne(gerneModel);
exports.getGerne = handlerFactory.getOne(gerneModel);
exports.getAllGerne = handlerFactory.getAll(gerneModel);
