import { Router } from "express";
import * as repositoryFunctions from "../repository/clientesRepository.js"
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { validarCadastro, validarLogin } from "../utils/validation.js";
import asyncHandler from "../utils/asyncHandler.js";
import config from "../config.js";
import { limitadorDeCadastro, limitadorDeLogin } from "../middlewares/rateLimiters.js";


const endpoints = Router()


endpoints.post("/cadastro", limitadorDeCadastro, asyncHandler(async (req, resp) => {
  const usuario = validarCadastro(req.body);
  const idCriado = await repositoryFunctions.criarUsuario(usuario);

  resp.status(201).send({ idCriado });
}));


endpoints.post("/login", limitadorDeLogin, asyncHandler(async (req, resp) => {
  const infoUser = validarLogin(req.body);
  const usuario = await repositoryFunctions.LogarUsuario(infoUser.email);

  if (!usuario) {
    return resp.status(401).json({ erro: "Email ou senha inválidos" });
  }

  const senhaCorreta = await bcrypt.compare(infoUser.senha, usuario.senha);

  if (!senhaCorreta) {
    return resp.status(401).json({ erro: "Email ou senha inválidos" });
  }

  const token = jwt.sign(
    { id: usuario.id },
    config.jwt.segredo,
    { expiresIn: config.jwt.expiracao }
  );

  resp.status(200).send({
    token: token,
    usuario: { nome: usuario.nome, role: usuario.isAdmin ? "admin" : "cliente" },
  });
}));


export default endpoints;
