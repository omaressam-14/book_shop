const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const data = await Model.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  });
};

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) return next(new AppError("no document found with this id", 404));

    res.status(204).json({
      status: "success",
      message: "the document deleted",
    });
  });
};

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidator: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const data = await Model.find();
    res.status(200).json({
      status: "success",
      results: data.length,
      data: {
        data,
      },
    });
  });
};

exports.getOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findById(id);

    if (!doc)
      return next(new AppError("there is no document with this id", 404));

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });
};
