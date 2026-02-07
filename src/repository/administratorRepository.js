import conection from "../database/conecction.js";



export async function listarTodosAgendamentos() {
    let  SQL = `SELECT*FROM agendamentos
    `

    let [consulta] = conection.query(SQL)

    return consulta[0]
}