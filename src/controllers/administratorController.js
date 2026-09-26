import { Router } from "express";
import authenticateToken from "../utils/jwt.js";
import isAdmin from "../utils/adminRole.js";
import { listarTodosAgendamentos } from "../repository/administratorRepository.js";
import asyncHandler from "../utils/asyncHandler.js";

const endpoints = Router()


endpoints.get("/listar/todos/agendamentos", authenticateToken, isAdmin, asyncHandler(async (req, resp) => {
  const dados = await listarTodosAgendamentos();

  resp.status(200).send(dados);
}));


export default endpoints
