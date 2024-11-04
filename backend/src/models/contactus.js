'use strict';
const connectDb = require('../db/dbConnection')
const config = require('./../config');

module.exports.getRecordById = function(params, callback){
    connectDb.stablishedConnection().then((db) => {
      var sql = `SELECT * FROM contact_details limit 1`;
      db.query(sql, function(err, result, fields){
        if(err){
            callback(err, null);
        }else{
          if(result.length > 0){
              result = JSON.parse(JSON.stringify(result[0]));
          }else{
              result = JSON.parse(JSON.stringify(result));
          }
          //get welcome note
          var sql1 = `SELECT welcome_note FROM settings limit 1`;
          db.query(sql1, function(err1, result1, fields){
            if(err1){
                callback(err, null);
            }else{
              if(result1.length > 0){
                result1 = JSON.parse(JSON.stringify(result1[0]));
              }else{
                result1 = JSON.parse(JSON.stringify(result1));
              }
              result.welcome_note = result1.welcome_note
              connectDb.closeDbConnection(db);
              callback(null, result);
            }
          });
        }
      });
    });
}

module.exports.updateRecords = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  let update_set = Object.keys(params).map(value=>{
    return ` ${value}  = "${params[value]}"`;
  });

  let update_query =  `UPDATE contact_details SET ${update_set.join(" ,")} WHERE id = "${1}"`;
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

module.exports.updateSettingRecords = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  let update_set = Object.keys(params).map(value=>{
    return ` ${value}  = "${params[value]}"`;
  });

  let update_query =  `UPDATE settings SET ${update_set.join(" ,")} WHERE id = "${1}"`;
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