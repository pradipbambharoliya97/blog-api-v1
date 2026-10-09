const getTokenFromheader = (req) => {
  const token = req.headers["authorization"]?.split(" ")?.[1];

  if (token !== undefined) {
    return token;
  }

  return {
    status: "fail",
    message: "there is no token",
  };
};

module.exports = getTokenFromheader;
