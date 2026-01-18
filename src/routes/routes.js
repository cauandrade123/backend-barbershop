import agendamentoController from "../controllers/agendamentoController.js"
import pagamentoController from "../controllers/pagamentocontroller.js"
import clientesController from "../controllers/clientesController.js"
import servicosController from "../controllers/servicosController.js"

export default function rotas (server){
    server.use(pagamentoController)
    server.use(clientesController)
    server.use(agendamentoController)
    server.use(servicosController)

}