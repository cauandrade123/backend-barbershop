import { Router } from "express";
import * as repositoryFunctions from "../repository/servicoRepository.js";
import authenticateToken from "../utils/jwt.js";
import isAdmin from "../utils/adminRole.js";
import { validarServico } from "../utils/validation.js";
import asyncHandler from "../utils/asyncHandler.js";

const endpoints = Router();

endpoints.post("/adicionarservico", authenticateToken, isAdmin, asyncHandler(async (req, resp) => {
  const addServico = validarServico(req.body);
  const servicoAdicionado = await repositoryFunctions.adicionarServico(addServico);

  resp.status(201).send({
    idServico: servicoAdicionado,
    nome: addServico.nome,
    preco: addServico.preco
  });
}));


export default endpoints;
