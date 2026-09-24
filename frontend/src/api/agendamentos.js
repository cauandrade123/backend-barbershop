import { requisitar } from "./client.js";

export function marcarServico({ servico_id, data_agendamento, hora_agendamento }) {
  return requisitar("/marcarservico", {
    method: "POST",
    autenticado: true,
    body: { servico_id, data_agendamento, hora_agendamento }
  });
}

export function listarMeusAgendamentos() {
  return requisitar("/meus/agendamentos", { autenticado: true });
}

export function remarcarAgendamento(id, { data_agendamento, hora_agendamento }) {
  return requisitar(`/agendamentos/${id}/remarcar`, {
    method: "PATCH",
    autenticado: true,
    body: { data_agendamento, hora_agendamento }
  });
}

export function listarTodosAgendamentos() {
  return requisitar("/listar/todos/agendamentos", { autenticado: true });
}
