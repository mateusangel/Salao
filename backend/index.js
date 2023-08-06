const express = require("express");
require("express-async-errors");
const app = express();
require("dotenv").config();
const helmet = require("helmet");
const csrf = require("csurf");
const routes = require("./routes/routes");
const path = require("path");
const cors = require("cors");

const mongoose = require("mongoose");
const error = require("./src/middlewares/Error");

mongoose.connect(process.env.CONECTIONSTRING).then(() => {
  console.log("Banco de dados conectado com Sucesso");
  app.emit("pronto");
});

app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// Para pegar o Body
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Configuração do middleware CORS

// cors

// app.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:5173/",
//   })
// );

//

// Segurança

app.use(helmet());

// Rotas
app.use(routes);
app.use(error);
// Estatico
// app.use(express.static(path.resolve(__dirname, "public", "css")));

app.on("pronto", () => {
  app.listen(process.env.PORT, () => {
    console.log("Servidor rodando...");
  });
});
