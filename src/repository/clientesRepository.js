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







