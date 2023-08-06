const User = require("../models/User");
const bcrypt = require("bcrypt");
const createUserToke = require("../helpers/create-user-token");
const gettoken = require("../helpers/get-token");
const jwt = require("jsonwebtoken");
const getUserToken = require("../helpers/get-user-token");
const store = require("../helpers/image-upload");
const HandlingErro = require("../Err/HandlingErro");

class UserController {
  async Register(req, res) {
    const { name, password, confirmpassword, email } = req.body;

    if (!name || !password || !confirmpassword || !email) {
      throw new HandlingErro("Todos os Campos São Obrigatorios", 422);
    }

    if (!name) {
      throw new HandlingErro("O nome é Obrigatorio", 422);
    }

    if (!password) {
      throw new HandlingErro("A Senha é Obrigatoria", 422);
    }

    if (!confirmpassword) {
      throw new HandlingErro("A  Confrimação da Senha é Obrigatoria", 422);
    }

    if (password !== confirmpassword) {
      throw new HandlingErro("As senhas devem ser iguais", 422);
    }

    if (!email) {
      throw new HandlingErro("O E-mail é Obrigatorio", 422);
    }

    const UserExists = await User.findOne({ email: email });

    if (UserExists) {
      throw new HandlingErro("Esse email já existe", 409);
    }

    // Criptografando a senha

    const salt = await bcrypt.genSalt(12);
    const passwordhash = await bcrypt.hash(password, salt);
    const confirmpasswordhash = await bcrypt.hash(confirmpassword, salt);

    //   criando usuario

    const Usuario = await User.create({
      name: name,
      password: passwordhash,
      confirmpassword: confirmpasswordhash,
      email: email,
    });

    console.log(Usuario);

    // Gerando o token e autenticando o usuario

    const token = await createUserToke(Usuario, req, res);
    try {
      res.json({
        mess: "Usuario Criado",
      });

      console.log("Usuario Criado");
      console.log(token);
    } catch (err) {
      console.log(err);
    }
  }

  // Login

  async Login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({
        mess: "O E-mail é Obrigatorio",
      });
      return;
    }
    if (!password) {
      res.status(422).json({
        mess: "A Senha é Obrigatoria",
      });
      return;
    }

    const Use = await User.findOne({ email: email });

    if (!Use) {
      res.status(422).json({
        mess: "Não há Usuário cadastrado com esse E-mail",
      });
      return;
    }

    // checando a senha

    const check = await bcrypt.compare(password, Use.password);

    if (!check) {
      res.json({
        mess: "Senha invalida",
      });
      return;
    }
    try {
      await createUserToke(Use, req, res);
    } catch (e) {
      console.log(e);
    }
  }

  // Checando o Usuário

  async CheckUser(req, res) {
    let currentUser;
    const token = gettoken(req);
    if (!token || token === " ") {
      res.json({ mess: "Acesso Negado" });
      return;
    }
    try {
      const decore = jwt.verify(token, process.env.SECRET);
      currentUser = await User.findById(
        decore.id,
        "-password -confirmpassword "
      );

      res.status(200).json({
        mess: "Usuario autenticado",
        currentUser,
      });
    } catch (err) {
      res.json({
        mess: "Token invalido",
      });
    }
  }

  async GetUserByid(req, res) {
    const id = req.params.id;
    try {
      const user = await User.findById(id).select("-password -confirmpassword");
      res.json({ user });
    } catch (error) {
      res.status(500).json({
        mess: "Usuario não encontrado",
      });
    }
  }

  async UpdateEditId(req, res) {
    const { name, password, confirmpassword, email, phone, img } = req.body;
    const token = gettoken(req);
    const user = await getUserToken(token);

    if (!name) {
      res.status(422).json({
        mess: "O Nome é Obrigatorio",
      });
      return;
    }

    if (name !== user.name) {
      res.json({
        mess: "O nome não confere",
      });
      return;
    }

    if (!password) {
      res.status(422).json({
        mess: "A Senha é Obrigatoria",
      });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({
        mess: "A  Confrimação da Senha é Obrigatoria",
      });
      return;
    }
    if (password !== confirmpassword) {
      res.status(422).json({
        mess: "As senhas devem ser iguais",
      });
      return;
    }
    const salt = await bcrypt.genSalt(12);
    const passwordhash = await bcrypt.hash(password, salt);
    const confirmpasswordhash = await bcrypt.hash(confirmpassword, salt);

    user.password = passwordhash;
    user.confirmpassword = confirmpasswordhash;

    if (!email) {
      res.status(422).json({
        mess: "O E-mail é Obrigatorio",
      });
      return;
    }
    const UserExists = await User.findOne({ email: email });

    if (UserExists !== email && UserExists) {
      res.json({
        mess: "Esse email já existe",
      });
      return;
    }
    user.email = email;
    if (!phone) {
      res.status(422).json({
        mess: "O telefone é Obrigatorio",
      });
      return;
    }
    user.phone = phone;

    try {
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );

      res.json({ mess: "Usuario Atualizado com Sucesso" });
    } catch (err) {
      res.json({
        mess: err,
      });
    }
  }

  async SendImage(req, res) {
    const fileName = req.file;
    try {
      res.json({
        mess: "Imagem aceita",
      });
      console.log(fileName);
    } catch (err) {
      res.json({
        mess: "Erro ao enviar o arquivo",
      });
    }
  }
}

module.exports = new UserController();
