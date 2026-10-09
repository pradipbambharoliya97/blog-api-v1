const { appError } = require("../utils/appError");
const getTokenFromheader = require("../utils/getTokenFromheader");
const verifyToken = require("../utils/verifyToken");

const isLogin = async (req, res, next) => {
  //get token from header
  const token = getTokenFromheader(req);

  // verify token
  const decodeduser = verifyToken(token);

  // save the user into req obj
  if (!decodeduser) {
    return next(appError("Invalid User", 401));
  }

  req.userAuth = decodeduser.id;
  next();
};

module.exports = isLogin;
