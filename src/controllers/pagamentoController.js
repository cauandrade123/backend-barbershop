import { Router } from "express";


const endpoints = Router()



endpoints.get("/deucerto", (req,res) =>{
    res.status(200).send("deu certo")
})









export default endpoints;