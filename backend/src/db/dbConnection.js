const config = require('./../config');
var mysql      = require('mysql');

module.exports.stablishedConnection = ()=>{
    return new Promise((resolve,reject)=>{
      const con = mysql.createConnection( {
        host: config.mysql.host,
        user: config.mysql.user,
        port: config.mysql.port,
        password: config.mysql.password,
        database: config.mysql.database
      });
      con.connect((err) => {
        if(err){
          console.log("MySql error");
          reject(err);
        }
        resolve(con);
      });
      
    })
}

module.exports.closeDbConnection =(con)=> {
    con.destroy();
}