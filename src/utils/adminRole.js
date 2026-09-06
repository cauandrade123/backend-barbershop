import { buscarUsuarioPorId } from "../repository/clientesRepository.js";

export default async function isAdmin(req, res, next) {
    try {
        const usuario = await buscarUsuarioPorId(req.userId);

        if (!usuario?.isAdmin) {
            return res.status(403).json({
                message: "Acesso negado. Apenas administradores podem acessar este recurso."
            });
        }

        return next();
    } catch (error) {
        return next(error);
    }
}
