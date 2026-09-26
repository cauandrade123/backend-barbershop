import express from "express"
import cors from "cors"
import helmet from "helmet"
import pinoHttp from "pino-http"
import routes from "./routes/routes.js"
import config from "./config.js"
import logger from "./utils/logger.js"
import { rotaNaoEncontrada, tratadorDeErros } from "./middlewares/errorHandler.js"

const server = express();

// Sem isto, atrás do proxy do Azure todo request chega com o IP do proxy e o
// rate limit passa a contar o mundo inteiro como um cliente só.
server.set("trust proxy", config.saltosDeProxy);

server.use(helmet());
server.use(pinoHttp({ logger }));
server.use(cors({
  origin: config.origensPermitidas.length > 0 ? config.origensPermitidas : "*"
}));
server.use(express.json({ limit: "100kb" }));

routes(server);

server.use(rotaNaoEncontrada);
server.use(tratadorDeErros);

export default server;
