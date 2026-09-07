import { Router } from "express";
import authenticateToken from "../utils/jwt.js";
import * as agendamentoService from "../services/agendamentoService.js";
import asyncHandler from "../utils/asyncHandler.js";

const endpoints = Router();


endpoints.post('/marcarservico', authenticateToken, asyncHandler(async (req, res) => {
  const clienteId = req.userId;
  const { servico_id, data_agendamento, hora_agendamento } = req.body;

  const idCriado = await agendamentoService.marcarServico(
    clienteId,
    servico_id,
    data_agendamento,
    hora_agendamento
  );

  res.status(201).json({
    id: idCriado,
    message: "Horário agendado!"
  });
}));


endpoints.get("/meus/agendamentos", authenticateToken, asyncHandler(async (req, resp) => {
  const agendamentos = await agendamentoService.listarMeusAgendamentos(req.userId);

  resp.status(200).send(agendamentos);
}));


endpoints.get("/servicos", asyncHandler(async (req, resp) => {
  const servicos = await agendamentoService.listarServicos();

  resp.status(200).send(servicos);
}));


endpoints.patch("/agendamentos/:id/remarcar", authenticateToken, asyncHandler(async (req, resp) => {
  const { data_agendamento, hora_agendamento } = req.body;

  await agendamentoService.remarcarAgendamento(
    req.params.id,
    req.userId,
    data_agendamento,
    hora_agendamento
  );

  resp.status(200).send({ mensagem: "Data remarcada com sucesso" });
}));


export default endpoints;
