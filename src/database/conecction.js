import mysql from 'mysql2/promise';

const conection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'barbershop',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000, 
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})



export default conection;