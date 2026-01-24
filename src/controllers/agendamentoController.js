import { Router } from "express";
import authenticateToken from "../utils/jwt.js"
import {MarcarServico} from "../repository/agendamentoRepository.js"

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

    const SalvarServico = await MarcarServico(escolhaServico);

    return res.status(201).json({
      id: SalvarServico,
      message: "Horário agendado!"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro interno" });
  }
});




endpoints.get(`/listaragendamentos`, (req,res)=>{
    
})







export default endpoints;