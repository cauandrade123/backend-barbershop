import conection from "../database/conecction.js";
import bcrypt from "bcrypt";


export async function criarUsuario(usuario) {

    let SQL = `
    insert into clientes(nome, email, telefone, senha)
    values(?,?,?,?)
    `

    const senhaHash = await bcrypt.hash(usuario.senha, 10);

    try {
        let [registro] = await conection.query(SQL, [usuario.nome, usuario.email, usuario.telefone, senhaHash])
        return registro.insertId;

    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            if (err.message.includes("email")) {
                throw new Error("Email já cadastrado");
            }
            if (err.message.includes("telefone")) {
                throw new Error("Telefone já cadastrado");
            }
            throw new Error("Dado já cadastrado");
        }
        throw err;
    }
}



export async function LogarUsuario(infoUser) {
  const SQL = `
    SELECT id, nome, email, senha, isAdmin
    FROM clientes
    WHERE email = ?
  `;

  const [linhas] = await conection.query(SQL, [infoUser.email]);

  return linhas[0];
}




