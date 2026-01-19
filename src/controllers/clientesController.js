import { Router } from "express";
import * as repositoryFunctions from "../repository/clientesRepository.js" 
import jwt from 'jsonwebtoken';



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

        
        if(!usuario){
            resp.status(401).send({
                erro: "Usuário ou Senha inválidos"
            })
        }
        
        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: "32d" }
        );



        resp.status(200).json({token})   

    
    } catch (error) {
        console.error(error);
        return resp.status(500).json({ erro: "Erro interno no servidor" });
    }
});









export default endpoints;