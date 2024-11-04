'use strict';
const connectDb = require('../db/dbConnection')
var nodemailer = require('nodemailer');
const config = require('../config');
const superagent = require('superagent');

/**Exammo APIs start */
/**
 * @param {whereCon: [{field: "email", value: postData.email}], table: 'users', select: 'id, name'} 
 */

module.exports.getRecords = function(params){
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      var whereStr = []
      var joinStr = []
      var str = "";
      var joinQuery = ''
      
      //Join condition
      if(params.join){
        params.join.forEach(element => {
          var con = ''
          con = `${element.joinType} ${element.joinWith} ON ${element.joinCondition}`;
          joinStr.push(con)
        });
        joinQuery = joinStr.join(" ");
        str = joinQuery;
      }
      
      //where condition
      if(params.whereCon){
        params.whereCon.forEach(element => {
          var con = ''
          if(element.value == 'NULL'){
            con = `${element.field} IS NULL`
          }else{
            con = `${element.field} = '${element.value}'`;
          }
          if(element.extraCondition){
            con = `${element.field} ${element.extraCondition} '${element.value}'`;
          }
          whereStr.push(con)
        });
        var str1 = whereStr.join(" AND ");
        str = str + " WHERE " + str1 
      }
      
      
      //str = str + ' ORDER by created_at DESC'

      if(params.pagination){
        let offsetValue = (params.pagination.page  params.pagination.pageSize) - params.pagination.pageSize; //2  10 = 20 -10 = 10
        let limitSql = ` LIMIT ${params.pagination.pageSize} OFFSET ${offsetValue}`;
        str = str + limitSql
      }
      const finalSql = `SELECT ${params.select} FROM ${params.table} ${str}`;
      console.log(finalSql);
      db.query(finalSql, function(err, result, fields){
        if(err){
          reject(err);
        }else{
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}
module.exports.check_duplicate = function (key, value, tableName, getKeyfromObject) {
  return new Promise((resolve, reject) => {
    if (getKeyfromObject) {
      value = value[getKeyfromObject];
      if (!value) {
        resolve('key_not_exist');
      }
    }
    var sql = `SELECT COUNT(${key}) as count FROM ${tableName} WHERE ${key} = ?`;
    console.log(value);
    connectDb.stablishedConnection().then((db) => {
      db.query(sql, [value], function (err, result, fields) {
        if (err) {
          console.log(err)
          reject(err);
        } else {
          result = JSON.parse(JSON.stringify(result))
          result = result[0].count
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });

}

module.exports.insertRecords = function (insertData, tableName) {
  return new Promise((resolve, reject) => {
    var keys = Object.keys(insertData)
    keys = keys.toString();
    var values = Object.values(insertData)
    var sql = `INSERT INTO ${tableName}(${keys}) VALUES ?`;
    connectDb.stablishedConnection().then((db) => {
      db.query(sql, [[values]], function (err, result, fields) {
        if (err) {
          console.log("Error: ", err)
          reject(err);
        } else {
          result = result.insertId
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}
/**Generate random number for OTP */
module.exports.generateNumber = function (length) {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
}

/**Send OTP on mobile */
module.exports.sendSMS = function (params) {
  return new Promise((resolve, reject) => {
    let smsParams = { ApiKey: config.SMS_API_KEY, ClientId: config.SMS_CLIENT_ID, SenderId: config.SMS_SENDER_ID, Message: params.message, MobileNumbers: params.contactNumber }
    superagent
      .post(config.SMS_URL)
      .set('Content-Type', 'application/json')
      .send(smsParams)
      .end((err, res) => {
        if (err) {
          console.log(err)
          reject(err);
        } else {
          let smsResponse = res.body.Data[0];
          if (!smsResponse.MessageErrorCode && smsResponse.MessageErrorDescription == 'Success') {
            resolve(true);
          } else {
            console.log('Error in send sms: ', smsResponse.MessageErrorDescription)
            resolve(false);
          }
        }
      });
  });
}

/**
 * @param {whereCon: [{field: "email", value: postData.email}], table: 'users'} 
 */
module.exports.deleteRecords = function (params) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      var whereStr = []
      var str = "";
      //where condition
      if (params.whereCon) {
        params.whereCon.forEach(element => {
          var con = `${element.field} = '${element.value}'`
          whereStr.push(con)
        });
        str = whereStr.join(" AND ");
        str = " WHERE " + str
      }

      db.query(`DELETE FROM ${params.table} ${str}`, function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result.affectedRows);
        }
      });
    });
  });
}

/**
 * Update records
 */
module.exports.updateRecords = function (keys, params) {
  return new Promise((resolve, reject) => {
    var updateValue = []
    var i = 0;
    var whereStr = []
    var str = "";
    if (keys.whereCon) {
      keys.whereCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
      str = " WHERE " + str
    }

    Object.keys(params).forEach(function (key, i) {
      if (typeof (params[key]) != "undefined") {
        if (key == "otp") {
          updateValue.push(key + " = " + params[key])
        } else {
          updateValue.push(key + " = '" + params[key] + "'")
        }
      }
    });
    updateValue = updateValue.toString()
    connectDb.stablishedConnection().then((db) => {
      db.query(`UPDATE ${keys.table} SET ${updateValue}  ${str}`, function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          result = result.affectedRows
          console.log(result + " record(s) updated");
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}

/*module.exports.sendVivahEmailAsync = function(mailOptions){
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'dinesh.jobsquare@gmail.com',
          pass: 'P@ssw0rd@2019'
      }
    });
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(err, info){
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}*/
/**END Exammo APIs */

module.exports.getReligions = function (params, callback) {
  connectDb.stablishedConnection().then((db) => {
    db.query(`SELECT id, name FROM religions WHERE status='${params.status}'`, function (err, result, fields) {
      if (err) {
        callback(err, null);
      } else {
        result = JSON.parse(JSON.stringify(result));
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.getCasteSubcaste = function (params, callback) {
  connectDb.stablishedConnection().then((db) => {
    var whereStr = []
    var str = "";
    if (params.whereCon) {
      params.whereCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
      str = " WHERE " + str
    }

    db.query(`SELECT id, caste_name FROM caste_lists ${str} ORDER BY caste_name`, function (err, result, fields) {
      if (err) {
        callback(err, null);
      } else {
        result = JSON.parse(JSON.stringify(result));
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.getMotherTongue = function (params, callback) {
  connectDb.stablishedConnection().then((db) => {
    var whereStr = []
    var str = "";
    if (params.whereCon) {
      params.whereCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
      str = " WHERE " + str
    }

    db.query(`SELECT id, name, type FROM mother_tongue ${str}`, function (err, result, fields) {
      if (err) {
        callback(err, null);
      } else {
        result = JSON.parse(JSON.stringify(result));
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.customUpdate = function (keys, params, callback) {
  var updateValue = []
  var i = 0;
  var whereStr = []
  var str = "";
  if (keys.whereCon) {
    keys.whereCon.forEach(element => {
      var con = `${element.field} = '${element.value}'`
      whereStr.push(con)
    });
    str = whereStr.join(" AND ");
    str = " WHERE " + str
  }

  Object.keys(params).forEach(function (key, i) {
    if (typeof (params[key]) != "undefined") {
      if (key == "otp") {
        updateValue.push(key + " = " + params[key])
      } else {
        updateValue.push(key + " = '" + params[key] + "'")
      }
    }
  });
  updateValue = updateValue.toString()
  connectDb.stablishedConnection().then((db) => {
    db.query(`UPDATE ${keys.table} SET ${updateValue}  ${str}`, function (err, result, fields) {
      if (err) {
        callback(err, null);
      } else {
        result = result.affectedRows
        console.log(result + " record(s) updated");
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.removeViewedContacts = function (params, callback) {
  if (params.user_id) {
    connectDb.stablishedConnection().then((db) => {
      db.query(`DELETE FROM view_contact_details WHERE viewedById = ${params.user_id}`, function (err, result, fields) {
        if (err) {
          callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          callback(null, result);
        }
      });
    });
  } else {
    callback("USER ID required.", null);
  }

}

module.exports.sendVivahEmail = function (mailOptions, callback) {
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'dinesh.jobsquare@gmail.com',
      pass: 'P@ssw0rd@2019'
    }
  });

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, true);
    }
  });
}
