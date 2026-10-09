const User = require("../modal/User/User");
const { appError } = require("../utils/appError");

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userAuth);

  const isAdmin = user.isAdmin === true;

  if (!isAdmin) {
    return next(appError("Access Denied, Admin only", 403));
  }

  next();
};

module.exports = isAdmin;
