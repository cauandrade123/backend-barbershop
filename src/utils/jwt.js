import 'dotenv/config'
import jwt from 'jsonwebtoken'


export default function authenticateToken(req, res, next) {
    console.log("🔥 MIDDLEWARE JWT EXECUTOU");
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);
    
  if (!authHeader) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ erro: "Token inválido" });
    }

    // 🔥 AQUI É O PONTO CHAVE
    req.userId = decoded.id;

    console.log("req.userId definido como:", req.userId);

    next();
  });
}





// export default function isAdmin(req, res, next){

  

// }
