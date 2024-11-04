'use strict';
const connectDb = require('../db/dbConnection')

module.exports.getBusinessCategories = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    db.query(`SELECT * FROM categories`, function(err, result, fields){
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

module.exports.getAllBusiness = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    db.query(`SELECT * FROM my_business WHERE users_id = ${params.users_id} `, function(err, result, fields){
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

module.exports.getUser = function(params, callback){
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
    
    db.query(`SELECT * FROM admin_users ${str}`, function(err, result, fields){
      if(err){
        console.log("Error: ",err)
        callback(err, null);
      }else{
        result = JSON.parse(JSON.stringify(result));
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.getUserById = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    db.query(`SELECT * FROM users WHERE id = '${params.id}'`, function(err, result, fields){
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

module.exports.searchBusiness = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    db.query(`SELECT * FROM my_business WHERE ${params.where}`, function(err, result, fields){
      if(err){
        console.log(err)
        callback(err, null);
      }else{
        result = JSON.parse(JSON.stringify(result));
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.updateBusiness = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  let update_set = Object.keys(params).map(value=>{
    return ` ${value}  = "${params[value]}"`;
  });

  let update_query =  `UPDATE my_business SET ${update_set.join(" ,")} WHERE id = "${params.id}" AND users_id = "${params.users_id}"`;
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

module.exports.insertBusiness = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  var values = Object.values(params)
  var sql = "INSERT INTO my_business("+keys+") VALUES ?";
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

module.exports.insert = function(params, callback){
  var sql = "INSERT INTO users(country_code, mobile_number, otp, device_id) VALUES ?";
  connectDb.stablishedConnection().then((db) => {
    db.query(sql, [params], function(err, result, fields){
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
};

module.exports.customUpdate = function(keys, params, callback){
  var updateValue = []
  var i = 0;

  Object.keys(params).forEach(function (key, i) {
      console.log(key)
      if (typeof (params[key]) != "undefined") {
        if(key == "otp"){
          updateValue.push(key +" = " + params[key])
        }else{
          updateValue.push(key +" = '" + params[key] +"'")
        }
      }
  });
  updateValue= updateValue.toString()   
  connectDb.stablishedConnection().then((db) => {
    db.query(`UPDATE users SET ${updateValue }  WHERE id = '${keys.id}'`, function(err, result, fields){
      if(err){
        callback(err, null);
      }else{
        result = result.affectedRows    
        console.log(result + " record(s) updated");
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.getDownloadList = function(params, callback){
  if (!params.pagination) {
    params.pagination = { pageSize: 20, pageNumber: 1 }
  } else {
      if (!params.pagination.pageSize) {
          params.pagination.pageSize = 20;
      }
      if (!params.pagination.pageNumber) {
          params.pagination.pageNumber = 1;
      }
  }

  let limit = ""

  if (params.pagination) {
      if (params.pagination.pageSize) {
          limit = " LIMIT " + params.pagination.pageSize
          if (params.pagination.pageNumber) {
              limit += " OFFSET " + ((params.pagination.pageNumber * params.pagination.pageSize) - params.pagination.pageSize)
          }
      }
  }
  connectDb.stablishedConnection().then((db) => {
    var sql = `SELECT * FROM downloads WHERE user_id = ${params.user_id} AND business_id = ${params.business_id}`

    if(limit){ sql += limit }

    db.query(sql, function(err, result, fields){
      if(err){
        console.log(err)
        callback(err, null);
      }else{
        result = JSON.parse(JSON.stringify(result));
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}
