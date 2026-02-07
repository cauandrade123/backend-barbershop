



 export default function isAdmin(req, res, next){

  if (req.role !== "admin") {
    return res.status(403).json({ 
      message: "Acesso negado. Apenas administradores." 
    });
  }


    next()

 }