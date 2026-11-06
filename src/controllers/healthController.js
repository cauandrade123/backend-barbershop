import { Router } from "express";
import { verificarConexao } from "../database/conecction.js";

const endpoints = Router();

// Liveness: o processo está de pé. Não toca no banco, senão uma queda do
// MySQL faria a plataforma reiniciar instâncias saudáveis em loop.
endpoints.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Readiness: a instância consegue atender tráfego de verdade.
endpoints.get("/ready", async (req, res) => {
  try {
    await verificarConexao();
    res.status(200).json({ status: "ok", banco: "conectado" });
  } catch (error) {
    req.log?.warn({ codigo: error?.code }, "readiness falhou");
    res.status(503).json({ status: "indisponivel", banco: "desconectado" });
  }
});

export default endpoints;
