import agendamentoController from "../controllers/agendamentoController.js"
import clientesController from "../controllers/clientesController.js"
import servicosController from "../controllers/servicosController.js"
import administratorController from "../controllers/administratorController.js"

export default function rotas (server){
    server.use(clientesController)
    server.use(agendamentoController)
    server.use(servicosController)
    server.use(administratorController)
}
