import conection from "../database/conecction.js";


export default async function adicionarServico(servico){
  
    try {
         let SQL = `INSERT INTO servicos(nome, preco)
          VALUES(?,?)`
        
          let registro = await conection.query(SQL, [servico.nome, servico.preco])
        
          let info = registro[0]
        
          return info.insertId
    
    } catch (error) {
      console.error(error)
      return error
    }
  
}