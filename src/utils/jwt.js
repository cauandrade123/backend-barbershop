import 'dotenv/config'
import jwt from 'jsonwebtoken'


export default function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ erro: "Token não enviado" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ erro: "Token inválido ou expirado" });
        }

        // Armazena os dados do token na requisição
        req.userId = decoded.id;
        req.role = decoded.role; // Aqui pegamos o 'admin' ou 'user' que colocamos no login

        next();
    });
}