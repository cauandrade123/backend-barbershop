import app from "./app.js";
import config, { validarConfiguracao } from "./config.js";
import logger from "./utils/logger.js";
import conexao, { verificarConexao } from "./database/conecction.js";

const TEMPO_LIMITE_DE_ENCERRAMENTO = 10_000;

function registrarEncerramento(servidor) {
  let encerrando = false;

  async function encerrar(sinal) {
    if (encerrando) return;
    encerrando = true;

    logger.info({ sinal }, "encerrando a API");

    // Se alguma conexão travar, o processo precisa morrer mesmo assim, senão
    // o orquestrador espera até o timeout dele para dar SIGKILL.
    const desistir = setTimeout(() => {
      logger.error("encerramento não concluiu a tempo, forçando saída");
      process.exit(1);
    }, TEMPO_LIMITE_DE_ENCERRAMENTO);
    desistir.unref();

    try {
      await new Promise((resolve, reject) => {
        servidor.close((erro) => (erro ? reject(erro) : resolve()));
      });
      await conexao.end();
      logger.info("encerramento concluído");
      process.exit(0);
    } catch (error) {
      logger.error({ mensagem: error?.message }, "falha ao encerrar");
      process.exit(1);
    }
  }

  process.on("SIGTERM", () => encerrar("SIGTERM"));
  process.on("SIGINT", () => encerrar("SIGINT"));
}

async function iniciarServidor() {
  try {
    validarConfiguracao();
    await verificarConexao();

    const servidor = app.listen(config.porta, () => {
      logger.info({ porta: config.porta, ambiente: config.ambiente }, "API disponível");
    });

    if (config.ambiente === "production" && config.origensPermitidas.length === 0) {
      logger.warn("CORS_ORIGINS não definido: a API aceita requisições de qualquer origem");
    }

    registrarEncerramento(servidor);
  } catch (error) {
    logger.error({ mensagem: error?.message }, "falha ao iniciar a API");
    process.exitCode = 1;
  }
}

process.on("unhandledRejection", (motivo) => {
  logger.error({ mensagem: motivo?.message ?? String(motivo) }, "rejeição não tratada");
});

process.on("uncaughtException", (error) => {
  logger.fatal({ mensagem: error?.message, stack: error?.stack }, "exceção não capturada");
  process.exit(1);
});

iniciarServidor();
