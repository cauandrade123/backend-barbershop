import "dotenv/config"

import express from "express"
import cors from "cors"
import routes from "./routes/routes.js"
import conection from "./database/conecction.js"



const server = express()


server.use(cors())
server.use(express.json())
routes(server)


const PORTA = process.env.PORTA
server.listen(PORTA, () =>{
    console.log(`api subiu na ` + PORTA)
})