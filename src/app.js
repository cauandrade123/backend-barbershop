import express from "express"
import cors from "cors"
import routes from "./routes/routes.js"
const server = express();

server.use(cors());
server.use(express.json({ limit: "100kb" }));
routes(server);

server.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

server.use((error, req, res, next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    erro: error.statusCode ? error.message : "Erro interno"
  });
});

export default server;
