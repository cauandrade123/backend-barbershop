import { Router } from "express";
import authenticateToken from "../utils/jwt.js";
import * as agendamentoService from "../services/agendamentoService.js";

const endpoints = Router();


endpoints.post('/marcarservico', authenticateToken, async (req, res) => {
    try {
          const clienteId = req.userId;
          const { servico_id, data_agendamento, hora_agendamento } = req.body;

          const idCriado = await agendamentoService.marcarServico(
            clienteId,
            servico_id,
            data_agendamento,
            hora_agendamento
          );

        return res.status(201).json({
          id: idCriado,
          message: "Horário agendado!"
        });

      } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        return res.status(status).json({ erro: error.message || "Erro interno" });
      }
});



endpoints.get("/meus/agendamentos", authenticateToken, async (req, resp) => {
  try {
    const clienteId = req.userId;
    const agendamentos = await agendamentoService.listarMeusAgendamentos(clienteId);

    resp.status(200).send(agendamentos);

  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    resp.status(status).json({ erro: error.message || "Erro interno" });
  }
});


endpoints.get("/servicos", async (req, resp) => {
  try {
    const servicos = await agendamentoService.listarServicos();
    resp.status(200).send(servicos);

  } catch (error) {
    console.error(error);
    resp.status(500).json({ erro: "Erro interno" });
  }
});


endpoints.patch("/agendamentos/:id/remarcar", authenticateToken, async (req, resp) => {
  try {
    const clienteId = req.userId;
    const idAgendamento = req.params.id;
    const { data_agendamento, hora_agendamento } = req.body;

    await agendamentoService.remarcarAgendamento(
      idAgendamento,
      clienteId,
      data_agendamento,
      hora_agendamento
    );

    resp.status(200).send({ mensagem: "Data remarcada com sucesso" });

  } catch (error) {
    console.error(error);
    const status = error.statusCode || 500;
    resp.status(status).json({ erro: error.message || "Erro interno" });
  }
});


export default endpoints;