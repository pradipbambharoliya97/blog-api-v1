// error funciton
const appError = (message, statusCode = 500) => {
  let err = new Error(message);
  err.statusCode = statusCode;
  err.stack = err.stack;

  return err;
};

module.exports = { appError };
