import { Router } from "express";
import * as repositoryFunctions from "../repository/clientesRepository.js" 
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import { validarCadastro, validarLogin } from "../utils/validation.js";


const endpoints = Router()


endpoints.post("/cadastro", async (req,resp) =>{
    try {

        const usuario = validarCadastro(req.body);

        let IdCriado = await repositoryFunctions.criarUsuario(usuario)

        resp.status(201).send({
            idCriado: IdCriado,
        })

    } catch (error) {
        console.error(error);
        return resp.status(error.statusCode || 500).json({ erro: error.statusCode ? error.message : "Erro interno" });
    }
})




endpoints.post("/login", async (req, resp) => {
  try {
    const infoUser = validarLogin(req.body);
    const senhaDigitada = infoUser.senha;

    const usuario = await repositoryFunctions.LogarUsuario(infoUser.email);

    if (!usuario) {
      return resp.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const senhaCorreta = await bcrypt.compare(senhaDigitada, usuario.senha);

    if (!senhaCorreta) {
      return resp.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    resp.status(200).send({
      token: token,
      usuario: { nome: usuario.nome, role: usuario.isAdmin ? "admin" : "cliente" },
    });
  } catch (error) {
    console.error(error);
    return resp.status(error.statusCode || 500).json({ erro: error.statusCode ? error.message : "Erro interno no servidor" });
  }
});









export default endpoints;
