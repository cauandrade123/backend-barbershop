import { Router } from "express";
import * as repositoryFunctions from "../repository/clientesRepository.js" 
import jwt from 'jsonwebtoken';
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
      return resp.status(401).json({ erro: "Usuário ou senha inválidos" });
    }

    // Agora usuario.id vai funcionar porque 'usuario' é o objeto da linha
    const token = jwt.sign(
      { id: usuario.id }, 
      process.env.JWT_SECRET,
      { expiresIn: "32d" }
    );

    console.log("ID DO USUÁRIO NO LOGIN:", usuario.id);
    return resp.status(200).json({ token });

  } catch (error) {
    console.error(error);
    return resp.status(500).json({ erro: "Erro interno no servidor" });
  }
});





endpoints.get("/meus/agendamentos", authenticateToken,async (req, resp)=>{

   try {
     let  MeusAgendamentos = req.userId;
 
     let listarMeusAgendamentos = await repositoryFunctions.listarMeusAgendamentos(MeusAgendamentos)

     resp.status(200).send(listarMeusAgendamentos)
 
   } catch (error) {

      console.error(error)
      resp.status(500).send({"Erro":error})

    }

})



endpoints.patch("/agendamentos/:id/remarcar", authenticateToken, async (req, resp)=>{

      try {
        
        let AlterarData = req.body;

        let clienteId = req.userId;

        let idAgendamento = req.params.id

        let remarcarData = await repositoryFunctions.RemarcarData(AlterarData, idAgendamento, clienteId)

        if(remarcarData === 0){
          return resp.status(404).send({
              erro: "Agendamento não encontrado ou não pertencente ao cliente"
          })
        }

        resp.status(200).send({
            mensagem: "Data remarcada com sucesso"
        })
        
      } catch (error) {
            console.error(error)
            resp.status(500).send({
              "Erro": "Erro interno!"
            })
      }

})








export default endpoints;