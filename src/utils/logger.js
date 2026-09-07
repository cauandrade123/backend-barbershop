import pino from "pino";
import config from "../config.js";

// NODE_TEST_CONTEXT é definido pelo runner do `node --test`.
const rodandoEmTeste = config.ambiente === "test" || Boolean(process.env.NODE_TEST_CONTEXT);

const logger = pino({
  level: rodandoEmTeste ? "silent" : config.nivelDeLog,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.senha",
      "res.headers['set-cookie']"
    ],
    censor: "[redigido]"
  }
});

export default logger;
