import { Router } from "express";


const endpoints = Router()

endpoints.get('/teste', (req, res) => {
  res.send('ok')
})










export default endpoints;