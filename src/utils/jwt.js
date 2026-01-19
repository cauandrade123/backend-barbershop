import 'dotenv/config'
import jwt from 'jsonwebtoken'



export default function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            console.error("Token inválido:", err);
            return res.sendStatus(403);
        }

        req.user = payload;
        next();
    });
}
