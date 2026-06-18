import conection from "../database/conecction.js";


export async function MarcarServico(agendamento) {
  const SQL = `
    INSERT INTO agendamentos (cliente_id, servico_id, data_agendamento, hora_agendamento, status)
    VALUES (?, ?, ?, ?, 'agendado')
  `;

  const [resposta] = await conection.query(SQL, [
    agendamento.cliente_id,
    agendamento.servico_id,
    agendamento.data_agendamento,
    agendamento.hora_agendamento
  ]);

  return resposta.insertId;
}


export async function listarMeusAgendamentos(Cliente_id) {

  let SQL = `SELECT
        a.id AS agendamento_id,
        s.nome AS nome_servico,
        s.preco AS preco_servico,
        a.data_agendamento,
        a.hora_agendamento,
        a.status
      FROM agendamentos a
      JOIN servicos s ON s.id = a.servico_id
      WHERE a.cliente_id = ?
      ORDER BY a.data_agendamento DESC, a.hora_agendamento DESC;
  `;

  let [registro] = await conection.query(SQL, [Cliente_id]);

  return registro;
}


export async function buscarServicoDoAgendamento(idAgendamento) {
    let SQL = `SELECT servico_id FROM agendamentos WHERE id = ?`;
    let [consulta] = await conection.query(SQL, [idAgendamento]);
    return consulta[0]?.servico_id;
}


export async function RemarcarData(remarcarData) {

  let SQL = `UPDATE agendamentos
    SET data_agendamento = ?, hora_agendamento = ?
    WHERE id = ? AND cliente_id = ?
  `;

  let [registro] = await conection.query(SQL, [
    remarcarData.data_agendamento,
    remarcarData.hora_agendamento,
    remarcarData.id,
    remarcarData.cliente_id
  ]);

  return registro.affectedRows;
}


export async function verificarHorarioOcupado(servico_id, data_agendamento, hora_agendamento, idAgendamentoAtual = null) {
    let SQL = `
        SELECT id FROM agendamentos
        WHERE servico_id = ?
        AND data_agendamento = ?
        AND hora_agendamento = ?
        AND status != 'cancelado'
        AND id != ?
    `;

    let [consulta] = await conection.query(SQL, [
        servico_id,
        data_agendamento,
        hora_agendamento,
        idAgendamentoAtual ?? 0
    ]);

    return consulta.length > 0;
}


export async function verificarServicoExiste(servico_id) {
    let SQL = `SELECT id FROM servicos WHERE id = ?`;
    let [consulta] = await conection.query(SQL, [servico_id]);
    return consulta.length > 0;
}


export async function listarServicos() {
    let SQL = `SELECT id, nome, preco FROM servicos`;
    let [consulta] = await conection.query(SQL);
    return consulta;
}