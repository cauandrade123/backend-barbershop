import { Router } from "express";


const endpoints = Router()



endpoints.get("/deucerto", (req,res) =>{
    res.status(200).json({ mensagem: "Pagamento confirmado" });
})









export default endpoints;
