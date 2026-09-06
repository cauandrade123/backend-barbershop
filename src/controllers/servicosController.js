import { Router } from "express";
import * as repositoryFunctions from "../repository/servicoRepository.js"; // confirme o nome exato do arquivo
import authenticateToken from "../utils/jwt.js";
import isAdmin from "../utils/adminRole.js";
import { validarServico } from "../utils/validation.js";

const endpoints = Router();

endpoints.post("/adicionarservico", authenticateToken, isAdmin, async (req, resp) => {

    try {
        const addServico = validarServico(req.body);
        const servicoAdicionado = await repositoryFunctions.adicionarServico(addServico);

        resp.status(201).send({
            idServico: servicoAdicionado,
            nome: addServico.nome,
            preco: addServico.preco
        });

    } catch (error) {
        console.error(error);
        return resp.status(error.statusCode || 500).json({ erro: error.statusCode ? error.message : "Erro interno" });
    }
});




export default endpoints;
