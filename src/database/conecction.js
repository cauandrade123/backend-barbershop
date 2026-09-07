import mysql from 'mysql2/promise';
import config from '../config.js';


const conection = mysql.createPool({
  host: config.banco.host,
  user: config.banco.usuario,
  database: config.banco.nome,
  password: config.banco.senha,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return (field.string() === '1');
    }
    // DECIMAL permanece string: converter para Number transforma dinheiro em
    // ponto flutuante binário e 0.10 + 0.20 deixa de ser 0.30.
    return next();
  }
})

export async function verificarConexao() {
  const connection = await conection.getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

export default conection;
