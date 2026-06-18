import conection from "../database/conecction.js";


export async function adicionarServico(servico) {

    let SQL = `
      INSERT INTO servicos (nome, preco)
      VALUES (?, ?)
    `;

    try {
        let [registro] = await conection.query(SQL, [servico.nome, servico.preco]);
        return registro.insertId;

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            throw new Error("Esse serviço já está cadastrado");
        }
        throw error;
    }
}