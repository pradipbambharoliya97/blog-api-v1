const globalErrorHandler = (err, req, res, next) => {
  //stack
  const stack = err.stack;

  //message
  const message = err.message;

  //status
  const status = err.status ? err.status : "Failed";
  const statusCode = err?.statusCode ? err.statusCode : 500;

  // send user response
  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

module.exports = globalErrorHandler;
