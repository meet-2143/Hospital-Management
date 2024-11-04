'use strict';
const connectDb = require('../db/dbConnection')
const config = require('./../config');

module.exports.getRecords = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    var whereStr = []
    var str = "";
    if(params.whereCon){
      params.whereCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
      str = " WHERE " + str
    }

    if(params.expireAt != undefined){
      str = str + " AND expired_at > CURDATE() ORDER BY updated_at DESC LIMIT 1";
    }
    str = str;
    console.log(str);
    db.query(`SELECT * FROM payments ${str}`, function(err, result, fields){
      if(err){
        callback(err, null);
      }else{
        result = JSON.parse(JSON.stringify(result));
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.getRecordById = function(params, callback){
    connectDb.stablishedConnection().then((db) => {
      //var sql = `SELECT *, DATE_FORMAT(created_at,'%d, %M %Y') AS storyDate  FROM stories WHERE id = ${params.id}`;
      var sql = `SELECT * as url FROM payments WHERE id =${params.id}`;
      db.query(sql, function(err, result, fields){
        if(err){
            callback(err, null);
        }else{
            if(result.length > 0){
                result = JSON.parse(JSON.stringify(result[0]));
            }else{
                result = JSON.parse(JSON.stringify(result));
            }
            connectDb.closeDbConnection(db);
            callback(null, result);
        }
      });
    });
}

module.exports.insertRecord = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  var values = Object.values(params)
  var sql = "INSERT INTO payments ("+keys+") VALUES ?";
  connectDb.stablishedConnection().then((db) => {
    db.query(sql, [[values]], function(err, result, fields){
      if(err){
        console.log(err)
        callback(err, null);
      }else{
        result = result.insertId
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.updateRecord = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  let update_set = Object.keys(params).map(value=>{
    return ` ${value}  = "${params[value]}"`;
  });

  let update_query =  `UPDATE payments SET ${update_set.join(" ,")} WHERE id = "${params.id}"`;
  connectDb.stablishedConnection().then((db) => {
    db.query(update_query, function(err, result, fields){
      if(err){
        console.log(err)
        callback(err, null);
      }else{
        result = result.insertId
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}