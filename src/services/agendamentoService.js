import * as repositoryFunctions from "../repository/agendamentoRepository.js";

export async function marcarServico(clienteId, servico_id, data_agendamento, hora_agendamento) {

    if (!servico_id || !data_agendamento || !hora_agendamento) {
        const erro = new Error("Todos os campos são obrigatórios");
        erro.statusCode = 400;
        throw erro;
    }

    const servicoExiste = await repositoryFunctions.verificarServicoExiste(servico_id);

    if (!servicoExiste) {
        const erro = new Error("Serviço inválido. Selecione um serviço da lista.");
        erro.statusCode = 400;
        throw erro;
    }

    const horarioOcupado = await repositoryFunctions.verificarHorarioOcupado(
        servico_id,
        data_agendamento,
        hora_agendamento,
        null
    );

    if (horarioOcupado) {
        const erro = new Error("Esse horário já está ocupado para esse serviço. Escolha outro.");
        erro.statusCode = 409;
        throw erro;
    }

    const escolhaServico = {
        cliente_id: clienteId,
        servico_id,
        data_agendamento,
        hora_agendamento
    };

    return await repositoryFunctions.MarcarServico(escolhaServico);
}


export async function listarMeusAgendamentos(clienteId) {
    return await repositoryFunctions.listarMeusAgendamentos(clienteId);
}


export async function listarServicos() {
    return await repositoryFunctions.listarServicos();
}


export async function remarcarAgendamento(idAgendamento, clienteId, data_agendamento, hora_agendamento) {

    if (!data_agendamento || !hora_agendamento) {
        const erro = new Error("Data e hora são obrigatórios");
        erro.statusCode = 400;
        throw erro;
    }

    const servico_id = await repositoryFunctions.buscarServicoDoAgendamento(idAgendamento);

    if (!servico_id) {
        const erro = new Error("Agendamento não encontrado");
        erro.statusCode = 404;
        throw erro;
    }

    const horarioOcupado = await repositoryFunctions.verificarHorarioOcupado(
        servico_id,
        data_agendamento,
        hora_agendamento,
        idAgendamento
    );

    if (horarioOcupado) {
        const erro = new Error("Esse horário já está ocupado. Escolha outro.");
        erro.statusCode = 409;
        throw erro;
    }

    const novaData = {
        data_agendamento,
        hora_agendamento,
        id: idAgendamento,
        cliente_id: clienteId
    };

    const linhasAfetadas = await repositoryFunctions.RemarcarData(novaData);

    if (linhasAfetadas === 0) {
        const erro = new Error("Agendamento não encontrado ou não pertencente ao cliente");
        erro.statusCode = 404;
        throw erro;
    }

    return true;
}