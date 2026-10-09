const Category = require("../../modal/Category/Category");
const { appError } = require("../../utils/appError");

exports.createCategoriesCtrl = async (req, res, next) => {
  const { title } = req.body;
  try {
    const category = await Category.create({ title, user: req.userAuth });

    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.getAllCategoriesCtrl = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.categoryDetailsCtrl = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.deleteCategoriesCtrl = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({
      status: "success",
      data: "Categories deleted successful",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

exports.updateCategoriesCtrl = async (req, res, next) => {
  const { title } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true },
    );

    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    next(appError(error.message));
  }
};
