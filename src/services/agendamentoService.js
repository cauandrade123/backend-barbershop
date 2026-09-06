import * as repositoryFunctions from "../repository/agendamentoRepository.js";
import { createHttpError } from "../utils/httpError.js";
import { validarNovoAgendamento, validarRemarcacao } from "../utils/validation.js";

export async function marcarServico(clienteId, servico_id, data_agendamento, hora_agendamento) {
    const dadosAgendamento = validarNovoAgendamento({
        servico_id,
        data_agendamento,
        hora_agendamento
    });

    const servicoExiste = await repositoryFunctions.verificarServicoExiste(dadosAgendamento.servico_id);

    if (!servicoExiste) {
        throw createHttpError(400, "Serviço inválido. Selecione um serviço da lista.");
    }

    const escolhaServico = {
        cliente_id: clienteId,
        ...dadosAgendamento
    };

    const idCriado = await repositoryFunctions.marcarServicoSeHorarioDisponivel(escolhaServico);
    if (!idCriado) {
        throw createHttpError(409, "Esse horário já está ocupado para esse serviço. Escolha outro.");
    }

    return idCriado;
}


export async function listarMeusAgendamentos(clienteId) {
    return await repositoryFunctions.listarMeusAgendamentos(clienteId);
}


export async function listarServicos() {
    return await repositoryFunctions.listarServicos();
}


export async function remarcarAgendamento(idAgendamento, clienteId, data_agendamento, hora_agendamento) {
    const dadosRemarcacao = validarRemarcacao(idAgendamento, {
        data_agendamento,
        hora_agendamento
    });

    const resultado = await repositoryFunctions.remarcarSeHorarioDisponivel({
        ...dadosRemarcacao,
        cliente_id: clienteId
    });

    if (resultado === "ocupado") {
        throw createHttpError(409, "Esse horário já está ocupado. Escolha outro.");
    }

    if (resultado === "nao_encontrado") {
        throw createHttpError(404, "Agendamento não encontrado, não pertence ao cliente ou não pode ser remarcado");
    }

    return true;
}
