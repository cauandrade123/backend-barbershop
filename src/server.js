import "dotenv/config";
import app from "./app.js";
import { verificarConexao } from "./database/conecction.js";

const PORTA = Number(process.env.PORT || process.env.PORTA || 3000);

function validarConfiguracao() {
  const obrigatorias = ["DB_USER", "DB_NAME", "DB_PWD", "JWT_SECRET"];
  const ausentes = obrigatorias.filter((nome) => !process.env[nome]);

  if (!process.env.DB_HOST && !process.env.HOST) {
    ausentes.push("DB_HOST");
  }

  if (ausentes.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${ausentes.join(", ")}`);
  }

  if (!Number.isInteger(PORTA) || PORTA < 1 || PORTA > 65535) {
    throw new Error("PORT ou PORTA deve conter uma porta válida");
  }
}

async function iniciarServidor() {
  try {
    validarConfiguracao();
    await verificarConexao();

    app.listen(PORTA, () => {
      console.log(`API disponível na porta ${PORTA}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar a API:", error.message);
    process.exitCode = 1;
  }
}

iniciarServidor();
