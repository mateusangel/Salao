const jwt = require("jsonwebtoken");

const User = require("../models/User");
const getUserToken = async (token) => {
  if (!token) {
    res.json({
      mess: "Esse token não existe",
    });
    return;
  }
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.id;
  const use = await User.findOne({ _id: userId });
  return use;
};

module.exports = getUserToken;
