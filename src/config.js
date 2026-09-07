import "dotenv/config";

// Importar este módulo nunca lança: a validação é explícita, via
// validarConfiguracao(), para que testes possam importar o app sem um .env.
const config = {
  ambiente: process.env.NODE_ENV || "development",
  porta: Number(process.env.PORT || process.env.PORTA || 3000),
  fusoHorario: process.env.TIMEZONE || "America/Sao_Paulo",
  nivelDeLog: process.env.LOG_LEVEL || "info",
  // Uma única camada de proxy (Azure App Service) na frente da aplicação.
  saltosDeProxy: Number(process.env.TRUST_PROXY || 1),
  origensPermitidas: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origem) => origem.trim())
    .filter(Boolean),
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),
  jwt: {
    segredo: process.env.JWT_SECRET,
    expiracao: process.env.JWT_EXPIRES_IN || "8h"
  },
  banco: {
    host: process.env.DB_HOST || process.env.HOST,
    usuario: process.env.DB_USER,
    nome: process.env.DB_NAME,
    senha: process.env.DB_PWD
  }
};

export function validarConfiguracao() {
  const ausentes = [];

  if (!config.banco.host) ausentes.push("DB_HOST");
  if (!config.banco.usuario) ausentes.push("DB_USER");
  if (!config.banco.nome) ausentes.push("DB_NAME");
  if (!config.banco.senha) ausentes.push("DB_PWD");
  if (!config.jwt.segredo) ausentes.push("JWT_SECRET");

  if (ausentes.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${ausentes.join(", ")}`);
  }

  if (!Number.isInteger(config.porta) || config.porta < 1 || config.porta > 65535) {
    throw new Error("PORT ou PORTA deve conter uma porta válida");
  }

  if (!Number.isInteger(config.bcryptRounds) || config.bcryptRounds < 10 || config.bcryptRounds > 15) {
    throw new Error("BCRYPT_ROUNDS deve ser um inteiro entre 10 e 15");
  }

  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: config.fusoHorario });
  } catch {
    throw new Error(`TIMEZONE inválido: ${config.fusoHorario}`);
  }
}

export default config;
