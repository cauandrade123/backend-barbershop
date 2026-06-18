import { Router } from "express";
import * as repositoryFunctions from "../repository/servicoRepository.js"; // confirme o nome exato do arquivo
import authenticateToken from "../utils/jwt.js";
import isAdmin from "../utils/adminRole.js";

const endpoints = Router();

endpoints.post("/adicionarservico", authenticateToken, isAdmin, async (req, resp) => {

    let addServico = req.body;

    try {
        let servicoAdicionado = await repositoryFunctions.adicionarServico(addServico);

        resp.status(201).send({
            idServico: servicoAdicionado,
            nome: addServico.nome,
            preco: addServico.preco
        });

    } catch (error) {
        if (error.message === "Esse serviço já está cadastrado") {
            return resp.status(409).json({ erro: error.message });
        }
        console.error(error);
        return resp.status(500).json({ erro: "Erro interno" });
    }
});




export default endpoints;