import logger from "../utils/logger.js";

export function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: "Rota não encontrada" });
}

// Erros de driver (mysql2) carregam `sql` e `sqlMessage` com valores da query,
// então os campos logados são escolhidos a dedo em vez de serializar o erro.
function dadosDoErro(error) {
  return {
    tipo: error?.name,
    mensagem: error?.message,
    codigo: error?.code,
    stack: error?.stack
  };
}

// A assinatura de 4 argumentos é o que faz o Express tratar isto como
// error handler.
export function tratadorDeErros(error, req, res, next) {
  const status = error?.statusCode || 500;
  const log = req.log || logger;

  if (status >= 500) {
    log.error({ err: dadosDoErro(error) }, "erro não tratado");
  }

  // Só mensagens de erros que criamos deliberadamente vazam para o cliente.
  res.status(status).json({
    erro: error?.statusCode ? error.message : "Erro interno"
  });
}
