import mysql from 'mysql2/promise.js';


const conection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  typeCast: function (field, next) {
     if (field.type === 'TINY' && field.length === 1) {
            return (field.string() === '1');
        } else if (field.type.includes('DECIMAL')) {
            return Number(field.string());
        } else {
            return next();
        }
    }
})


console.log(`database conected`)


export default conection;