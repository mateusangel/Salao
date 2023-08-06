const jwt = require("jsonwebtoken");

const createUserToke = async (user, req, res) => {
  const token = await jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.SECRET
  );

  res.status(200).json({
    mess: "Você está Autenticado",
    message: "Usuário Criado Com Sucesso",
    token: token,
    userid: user._id,
  });
};

module.exports = createUserToke;
