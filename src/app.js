import "dotenv/config"

import express from "express"
import cors from "cors"
import controllers from "./controllers/clientesController.js"




const server = express()


server.use(cors())
server.use(express.json())
server.use(controllers)



const PORTA = process.env.PORTA
server.listen(PORTA, () =>{
    console.log(`api subiu na ` + PORTA)
})