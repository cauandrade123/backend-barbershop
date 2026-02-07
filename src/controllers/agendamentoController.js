import { Router } from "express";
import authenticateToken from "../utils/jwt.js"
import * as repositoryFunctions from "../repository/agendamentoRepository.js"


const endpoints = Router()


endpoints.post('/marcarservico', authenticateToken, async (req, res) => {

  try {
    console.log("USER ID NO AGENDAMENTO:", req.userId);
    console.log("BODY RECEBIDO:", req.body);

    let clienteId = req.userId;
      
    const escolhaServico = {
      cliente_id: clienteId,
      servico_id: req.body.servico_id,
      data_agendamento: req.body.data_agendamento,
      hora_agendamento: req.body.hora_agendamento
    };

    const SalvarServico = await repositoryFunctions.MarcarServico(escolhaServico);

    return res.status(201).json({
      id: SalvarServico,
      message: "Horário agendado!"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno" });
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