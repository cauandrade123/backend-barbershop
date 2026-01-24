import conection from "../database/conecction.js";



export async function criarUsuario(usuario) {

    let SQL = `
    insert into clientes(nome, email, telefone, senha)
    values(?,?,?,?)
    `

    let registro = await conection.query(SQL,[usuario.nome, usuario.email, usuario.telefone, usuario.senha])

    let info = registro[0]

    return info.insertId;

}



export async function LogarUsuario(infoUser) {
  const SQL = `
    SELECT id, email, senha
    FROM clientes
    WHERE email = ? AND senha = ?
  `;

  const [linhas] = await conection.query(SQL, [infoUser.email, infoUser.senha]);

  return linhas[0];
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

      return registro[0];
}



export async function RemarcarData(remarcarData){

    let SQL = `UPDATE agendamentos
    SET data_agendamento = ?, hora_agendamento = ?
    WHERE id = ? AND cliente_id = ?
    `

    let [registro] = await conection.query(SQL, [remarcarData.data_agendamento, remarcarData.hora_agendamento, remarcarData.id, remarcarData.cliente_id])

    return registro.affectedRows;

}