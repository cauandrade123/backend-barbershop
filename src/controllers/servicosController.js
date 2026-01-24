import { Router } from "express";
import adicionarServico from "../repository/servicoRepository.js";

const endpoints = Router()


endpoints.post("/adicionarservico", async (req, resp)=>{
    
    let addServico = req.body;

    try {

        let servicoAdicionado = await adicionarServico(addServico)

        resp.status(201).send({
            idServico: servicoAdicionado,
            Nome: adicionarServico.nome,
            Preço: adicionarServico.preco
        })


        
    } catch (error) {
        console.error(error)
        return resp.status(500).json({ erro: "Erro interno" });
    }

})







export default endpoints;