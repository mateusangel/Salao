const gettoken = (req) => {
  const headertoken = req.headers.authorization;
  if (!headertoken || headertoken === " ") {
    return null;
  }
  const token = headertoken.split(" ")[1];

  return token;
};

module.exports = gettoken;
