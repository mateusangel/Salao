const express = require("express");
const routes = express.Router();
const UserController = require("../src/controllers/UserController");
const store = require("../src/helpers/image-upload");
// Middleware
const checktoken = require("../src/helpers/verify-token");

// Multer

// User
routes.post("/Cadastro", UserController.Register);
routes.post("/User/Login", UserController.Login);
routes.get("/User/Check", UserController.CheckUser);
routes.get("/User/:id", UserController.GetUserByid);
routes.patch("/User/edit", checktoken, UserController.UpdateEditId);
routes.post("/User/image", store.single("file"), UserController.SendImage);

module.exports = routes;
