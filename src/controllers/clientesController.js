import { Router } from "express";
import * as repositoryFunctions from "../repository/clientesRepository.js" 

const endpoints = Router()


endpoints.post("/cadastro", async (req,resp) =>{
    try {
       let usuario = req.body;

        let IdCriado = await repositoryFunctions.criarUsuario(usuario)

        resp.status(201).send({
            idCriado: IdCriado
        })

    } catch (error) {
          console.error(error);
          return resp.status(500).json({ erro: "Erro interno" });
    }
})



endpoints.post(`/login`, (req,resp)=>{

    try {
        infoUser = req.body;
    
        let usuarioCadastrado = await 
    
    } catch (error) {
        console.error(error)
        return resp.status(401).json({
            erro: "Usuário não encontrado/cadastrado"
        })
    }
})








export default endpoints;