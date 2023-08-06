const jwt = require("jsonwebtoken");
const gettoken = require("./get-token");

const checktoken = (req, res, next) => {
  const headers = req.headers.authorization;

  if (!headers) {
    res.status(401).json({
      mess: "Acesso Negado!",
    });
    return;
  }
  const token = gettoken(req);

  try {
    const toke = jwt.verify(token, process.env.SECRET);
    req.user = toke;
    next();
  } catch (err) {
    res.status(400).json({
      mess: "Token invalido",
    });
  }
};

module.exports = checktoken;
