import { Router } from "express";
import authenticateToken from "../utils/jwt.js";
import isAdmin from "../utils/adminRole.js";
import { listarTodosAgendamentos } from "../repository/administratorRepository.js";

const endpoints = Router()



endpoints.get("/listar/todos/agendamentos",isAdmin, authenticateToken, async (req,resp)=>{
    try {
        const dados = listarTodosAgendamentos()

        resp.status(200).send(dados)

    } catch (error) {
        console.error(error)
        resp.status(500).send("Erro interno!")
    }
})








export default endpoints