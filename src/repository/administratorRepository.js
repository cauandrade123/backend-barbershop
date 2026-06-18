import conection from "../database/conecction.js";



export async function listarTodosAgendamentos() {
    let SQL = `
        SELECT 
            agendamentos.id,
            agendamentos.cliente_id,
            clientes.nome AS nome_cliente,
            agendamentos.servico_id,
            servicos.nome AS nome_servico,
            agendamentos.data_agendamento,
            agendamentos.hora_agendamento,
            agendamentos.status
        FROM agendamentos
        JOIN clientes ON agendamentos.cliente_id = clientes.id
        JOIN servicos ON agendamentos.servico_id = servicos.id
    `;

    let [consulta] = await conection.query(SQL);

    return consulta;
}