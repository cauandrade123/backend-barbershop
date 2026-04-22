import { Router } from "express";
import * as repositoryFunctions from "../repository/clientesRepository.js" 
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import authenticateToken from "../utils/jwt.js";


const endpoints = Router()


endpoints.post("/cadastro", async (req,resp) =>{
    try {

        let usuario = req.body;

        let IdCriado = await repositoryFunctions.criarUsuario(usuario)

        resp.status(201).send({
            idCriado: IdCriado,
        })

    } catch (error) {
        console.error(error);
        return resp.status(500).json({ erro: "Erro interno" });
    }
})



endpoints.post("/login", async (req, resp) => {
  try {
    const infoUser = req.body;

    const usuario = await repositoryFunctions.LogarUsuario(infoUser);

    if (!usuario) {
      throw new Error("Email ou senha inválidos");
    }
 
  const senhaCorreta = await bcrypt.compare(senhaDigitada, usuario.senha);

    if (!senhaCorreta) {
      throw new Error("Email ou senha inválidos");
    }


    const token = jwt.sign(
      { id: usuario.id, role: userRole }, 
      process.env.JWT_SECRET,
      { expiresIn: "32d" }
    );

    console.log("ID DO USUÁRIO NO LOGIN:", usuario.id);


        resp.status(200).send({
            token: token, usuario: {nome: usuario.nome, role: userRole}
        });
        

  } catch (error) {
    console.error(error);
    return resp.status(500).json({ erro: "Erro interno no servidor" });
  }
});


















export default endpoints;