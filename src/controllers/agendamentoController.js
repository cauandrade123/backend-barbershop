import { Router } from "express";
import authenticatetoken from "../utils/jwt.js"

const endpoints = Router()


endpoints.post(`/marcarservico`, authenticatetoken , (req,res)=>{
    
})


endpoints.get(`/listaragendamentos`, (req,res)=>{
    
})







export default endpoints;