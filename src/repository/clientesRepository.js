import conection from "../database/conecction.js";
import bcrypt from "bcrypt";


export async function criarUsuario(usuario) {

    let SQL = `
    insert into clientes(nome, email, telefone, senha)
    values(?,?,?,?)
    `

    const senhaHash = await bcrypt.hash(usuario.senha, 10);


    try {
      
          let [registro] = await conection.query(SQL,[usuario.nome, usuario.email, usuario.telefone, senhaHash])
      
          return registro.insertId;

    } catch (err) {

          if (err.code === "ER_DUP_ENTRY") {
            throw new Error("Email já cadastrado");
          }

        throw err;
      }

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







