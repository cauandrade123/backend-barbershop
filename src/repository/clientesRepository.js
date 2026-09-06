import conection from "../database/conecction.js";
import bcrypt from "bcrypt";
import { createHttpError } from "../utils/httpError.js";


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
                throw createHttpError(409, "Email já cadastrado");
            }
            if (err.message.includes("telefone")) {
                throw createHttpError(409, "Telefone já cadastrado");
            }
            throw createHttpError(409, "Dado já cadastrado");
        }
        throw err;
    }
}



export async function LogarUsuario(email) {
  const SQL = `
    SELECT id, nome, email, senha, isAdmin
    FROM clientes
    WHERE email = ?
  `;

  const [linhas] = await conection.query(SQL, [email]);

  return linhas[0];
}

export async function buscarUsuarioPorId(id) {
  const SQL = `
    SELECT id, isAdmin
    FROM clientes
    WHERE id = ?
  `;

  const [linhas] = await conection.query(SQL, [id]);
  return linhas[0];
}




