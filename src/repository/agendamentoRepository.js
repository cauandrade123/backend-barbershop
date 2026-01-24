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
