import conection from "../database/conecction.js";



export async function MarcarServico(agendamento) {
  const SQL = `
    INSERT INTO agendamentos (cliente_id, servico_id, data_agendamento, hora_agendamento)
    VALUES (?, ?, ?, ?)
  `;

  // Certifique-se de que está usando agendamento.cliente_id aqui
  const [resposta] = await conection.query(SQL, [
    agendamento.cliente_id, 
    agendamento.servico_id, 
    agendamento.data_agendamento, 
    agendamento.hora_agendamento
  ]);

  return resposta.insertId;
}



export async function listarMeusAgendamentos(Cliente_id){

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
      `

      let [registro] = await conection.query(SQL,[Cliente_id])

      return registro;
}



export async function RemarcarData(remarcarData){

    let SQL = `UPDATE agendamentos
    SET data_agendamento = ?, hora_agendamento = ?
    WHERE id = ? AND cliente_id = ?
    `

    let [registro] = await conection.query(SQL, [remarcarData.data_agendamento, remarcarData.hora_agendamento, remarcarData.id, remarcarData.cliente_id])

    return registro.affectedRows;

}

