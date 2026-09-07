import jwt from 'jsonwebtoken'
import config from '../config.js'


export default function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    const [tipo, token] = authHeader?.trim().split(/\s+/) || [];
    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({ erro: "Token Bearer não enviado ou inválido" });
    }

    try {
        const decoded = jwt.verify(token, config.jwt.segredo);
        req.userId = decoded.id;
        return next();
    } catch (error) {
        return res.status(401).json({ erro: "Token inválido ou expirado" });
    }
}
