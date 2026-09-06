import conection from "../database/conecction.js";
import { createHttpError } from "../utils/httpError.js";

const TEMPO_MAXIMO_BLOQUEIO = 5;

function bloqueioDoHorario(servicoId, dataAgendamento, horaAgendamento) {
  return `barbearia:horario:${servicoId}:${dataAgendamento}:${horaAgendamento}`;
}

function bloqueioDoAgendamento(idAgendamento) {
  return `barbearia:agendamento:${idAgendamento}`;
}

async function executarComBloqueio(connection, nomeBloqueio, operacao) {
  const [[resultado]] = await connection.query(
    "SELECT GET_LOCK(?, ?) AS bloqueado",
    [nomeBloqueio, TEMPO_MAXIMO_BLOQUEIO]
  );

  if (Number(resultado.bloqueado) !== 1) {
    throw createHttpError(503, "Não foi possível reservar o horário agora. Tente novamente.");
  }

  try {
    return await operacao();
  } finally {
    await connection.query("SELECT RELEASE_LOCK(?)", [nomeBloqueio]);
  }
}

async function horarioEstaOcupado(connection, servicoId, dataAgendamento, horaAgendamento, idIgnorado = 0) {
  const SQL = `
    SELECT id
    FROM agendamentos
    WHERE servico_id = ?
      AND data_agendamento = ?
      AND hora_agendamento = ?
      AND status != 'cancelado'
      AND id != ?
    LIMIT 1
  `;

  const [consulta] = await connection.query(SQL, [
    servicoId,
    dataAgendamento,
    horaAgendamento,
    idIgnorado
  ]);

  return consulta.length > 0;
}

export async function marcarServicoSeHorarioDisponivel(agendamento) {
  const connection = await conection.getConnection();
  const nomeBloqueio = bloqueioDoHorario(
    agendamento.servico_id,
    agendamento.data_agendamento,
    agendamento.hora_agendamento
  );

  try {
    return await executarComBloqueio(connection, nomeBloqueio, async () => {
      const ocupado = await horarioEstaOcupado(
        connection,
        agendamento.servico_id,
        agendamento.data_agendamento,
        agendamento.hora_agendamento
      );

      if (ocupado) {
        return null;
      }

      const SQL = `
        INSERT INTO agendamentos (cliente_id, servico_id, data_agendamento, hora_agendamento, status)
        VALUES (?, ?, ?, ?, 'agendado')
      `;
      const [resposta] = await connection.query(SQL, [
        agendamento.cliente_id,
        agendamento.servico_id,
        agendamento.data_agendamento,
        agendamento.hora_agendamento
      ]);

      return resposta.insertId;
    });
  } finally {
    connection.release();
  }
}

export async function remarcarSeHorarioDisponivel(remarcacao) {
  const connection = await conection.getConnection();
  const bloqueioAgendamento = bloqueioDoAgendamento(remarcacao.id);

  try {
    return await executarComBloqueio(connection, bloqueioAgendamento, async () => {
      const SQL_AGENDAMENTO = `
        SELECT id, servico_id
        FROM agendamentos
        WHERE id = ? AND cliente_id = ? AND status = 'agendado'
      `;
      const [agendamentos] = await connection.query(SQL_AGENDAMENTO, [
        remarcacao.id,
        remarcacao.cliente_id
      ]);
      const agendamento = agendamentos[0];

      if (!agendamento) {
        return "nao_encontrado";
      }

      const bloqueioHorario = bloqueioDoHorario(
        agendamento.servico_id,
        remarcacao.data_agendamento,
        remarcacao.hora_agendamento
      );

      return executarComBloqueio(connection, bloqueioHorario, async () => {
        const ocupado = await horarioEstaOcupado(
          connection,
          agendamento.servico_id,
          remarcacao.data_agendamento,
          remarcacao.hora_agendamento,
          remarcacao.id
        );

        if (ocupado) {
          return "ocupado";
        }

        const SQL_ATUALIZAR = `
          UPDATE agendamentos
          SET data_agendamento = ?, hora_agendamento = ?
          WHERE id = ? AND cliente_id = ? AND status = 'agendado'
        `;
        const [resultado] = await connection.query(SQL_ATUALIZAR, [
          remarcacao.data_agendamento,
          remarcacao.hora_agendamento,
          remarcacao.id,
          remarcacao.cliente_id
        ]);

        return resultado.affectedRows === 1 ? "remarcado" : "nao_encontrado";
      });
    });
  } finally {
    connection.release();
  }
}

export async function listarMeusAgendamentos(clienteId) {
  const SQL = `SELECT
        a.id AS agendamento_id,
        s.nome AS nome_servico,
        s.preco AS preco_servico,
        a.data_agendamento,
        a.hora_agendamento,
        a.status
      FROM agendamentos a
      JOIN servicos s ON s.id = a.servico_id
      WHERE a.cliente_id = ?
      ORDER BY a.data_agendamento DESC, a.hora_agendamento DESC`;

  const [registro] = await conection.query(SQL, [clienteId]);
  return registro;
}

export async function verificarServicoExiste(servicoId) {
  const SQL = "SELECT id FROM servicos WHERE id = ?";
  const [consulta] = await conection.query(SQL, [servicoId]);
  return consulta.length > 0;
}

export async function listarServicos() {
  const SQL = "SELECT id, nome, preco FROM servicos";
  const [consulta] = await conection.query(SQL);
  return consulta;
}
