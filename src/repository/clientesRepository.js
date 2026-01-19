import conection from "../database/conecction.js";



export async function criarUsuario(usuario) {

    let SQL = `
    insert into clientes(nome, email, telefone)
    values(?,?,?)
    `

    let registro = await conection.query(SQL,[usuario.nome, usuario.email, usuario.telefone])

    let info = registro[0]

    return info.insertId;


}