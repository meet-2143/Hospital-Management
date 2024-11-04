'use strict';
const connectDb = require('../db/dbConnection')
var nodemailer = require('nodemailer');
const config = require('../config');
const superagent = require('superagent');

/**Exammo APIs start */
/**
 * @param {whereCon: [{field: "email", value: postData.email}], table: 'users', select: 'id, name'} 
 */

module.exports.getRecords = function (params) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      var whereStr = []
      var joinStr = []
      var str = "";
      var joinQuery = ''
      if (params.join) {
        params.join.forEach(element => {
          var con = ''
          con = `${element.joinType} ${element.joinWith} ON ${element.joinCondition}`;
          joinStr.push(con)
        });
        joinQuery = joinStr.join(" ");
        str = joinQuery;
      }
      if (params.whereCon) {
        params.whereCon.forEach(element => {
          var con = ''
          if (element.value == 'NULL') {
            con = `${element.field} IS NULL`
          } else {
            con = `${element.field} = '${element.value}'`;
          }
          if (element.extraCondition) {
            con = `${element.field} ${element.extraCondition} '${element.value}'`;
          }
          whereStr.push(con)
        });
        var str1 = whereStr.join(" AND ");
        str = str + " WHERE " + str1
      }
      if (params.pagination) {
        let offsetValue = (params.pagination.page * params.pagination.pageSize) - params.pagination.pageSize; //2 * 10 = 20 -10 = 10
        let limitSql = ` LIMIT ${params.pagination.pageSize} OFFSET ${offsetValue}`;
        str = str + limitSql
      }
      const finalSql = `SELECT ${params.select} FROM ${params.table} ${str}`;
      console.log(finalSql);
      db.query(finalSql, function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}




/*Search Record*/
module.exports.getSearchRecords = function (params) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      var whereStr = []
      var joinStr = []
      var str = "";
      var joinQuery = ''
      var searchSrt = ''

      //Join condition
      if (params.join) {
        params.join.forEach(element => {
          var con = ''
          con = `${element.joinType} ${element.joinWith} ON ${element.joinCondition}`;
          joinStr.push(con)
        });
        joinQuery = joinStr.join(" ");
        str = joinQuery;
      }
      if (params.search) {
        params.search.forEach(element => {
          searchSrt = `AND ${element.field}  LIKE '%${element.value}%'`;
        });
      }
      /*console.log(searchSrt);
      return;*/

      //where condition
      if (params.whereCon) {
        params.whereCon.forEach(element => {
          var con = ''
          if (element.value == 'NULL') {
            con = `${element.field} IS NULL`
          } else {
            con = `${element.field} = '${element.value}'`;
          }
          if (element.extraCondition) {
            con = `${element.field} ${element.extraCondition} '${element.value}'`;
          }
          whereStr.push(con)
        });
        var str1 = whereStr.join(" AND ");
        str = str + " WHERE " + str1
      }
      //str = str + ' ORDER by created_at DESC'
      if (params.pagination) {
        let offsetValue = (params.pagination.page * params.pagination.pageSize) - params.pagination.pageSize; //2 * 10 = 20 -10 = 10
        let limitSql = ` LIMIT ${params.pagination.pageSize} OFFSET ${offsetValue}`;
        str = str + limitSql
      }
      const finalSql = `SELECT ${params.select} FROM ${params.table} ${str} ${searchSrt}`;
      console.log(finalSql);
      db.query(finalSql, function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}
/*End Search Record*/


module.exports.getLenderRecords = function (params) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      var whereStr = []
      var joinStr = []
      var str = "";
      var str2 = "";
      var joinQuery = ''

      //Join condition
      if (params.join) {
        params.join.forEach(element => {
          var con = ''
          con = `${element.joinType} ${element.joinWith} ON ${element.joinCondition}`;
          joinStr.push(con)
        });
        joinQuery = joinStr.join(" ");
        str = joinQuery;
      }

      //where condition
      if (params.whereCon) {
        params.whereCon.forEach(element => {
          var con = ''
          if (element.value == 'NULL') {
            con = `${element.field} IS NULL`
          } else {
            con = `${element.field} = '${element.value}'`;
          }
          if (element.extraCondition) {
            con = `${element.field} ${element.extraCondition} '${element.value}'`;
            var str2 = whereStr.join(" OR ");
          }
          whereStr.push(con)
        });
        var str1 = whereStr.join(" AND ");
        str = str + " WHERE " + str1 + str2
      }


      //str = str + ' ORDER by created_at DESC'

      if (params.pagination) {
        let offsetValue = (params.pagination.page * params.pagination.pageSize) - params.pagination.pageSize; //2 * 10 = 20 -10 = 10
        let limitSql = ` LIMIT ${params.pagination.pageSize} OFFSET ${offsetValue}`;
        str = str + limitSql
      }
      const finalSql = `SELECT ${params.select} FROM ${params.table} ${str}`;
      console.log(finalSql);
      db.query(finalSql, function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}


module.exports.getStartRecords = function (params) {
  /*console.log(params);
  return;*/
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      var whereStr = []
      var joinStr = []
      var str = "";
      var joinQuery = ''

      //Join condition
      if (params.join) {
        params.join.forEach(element => {
          var con = ''
          con = `${element.joinType} ${element.joinWith} ON ${element.joinCondition}`;
          joinStr.push(con)
        });
        joinQuery = joinStr.join(" ");
        str = joinQuery;
      }

      //where condition
      if (params.whereCon) {
        params.whereCon.forEach(element => {
          var con = ''
          if (element.value == 'NULL') {
            con = `${element.field} IS NULL`
          } else {
            con = `${element.field} = '${element.value}'`;
          }
          if (element.extraCondition) {
            con = `${element.field} ${element.extraCondition} '${element.value}'`;
          }
          whereStr.push(con)
        });
        var str1 = whereStr.join(" AND ");
        str = str + " WHERE " + str1
      }


      //str = str + ' ORDER by created_at DESC'

      if (params.pagination) {
        let offsetValue = (params.pagination.page * params.pagination.pageSize) - params.pagination.pageSize; //2 * 10 = 20 -10 = 10
        let limitSql = ` LIMIT ${params.pagination.pageSize} OFFSET ${offsetValue}`;
        str = str + limitSql
      }
      const finalSql = `SELECT ${params.select} FROM ${params.table} ${str} group by id`;
      /*console.log(finalSql);
      return;*/
      db.query(finalSql, function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}

/*Last record*/
module.exports.getLastRecords = function (params) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      var whereStr = []
      var joinStr = []
      var str = "";
      var joinQuery = ''

      //Join condition
      if (params.join) {
        params.join.forEach(element => {
          var con = ''
          con = `${element.joinType} ${element.joinWith} ON ${element.joinCondition}`;
          joinStr.push(con)
        });
        joinQuery = joinStr.join(" ");
        str = joinQuery;
      }

      //where condition
      if (params.whereCon) {
        params.whereCon.forEach(element => {
          var con = ''
          if (element.value == 'NULL') {
            con = `${element.field} IS NULL`
          } else {
            con = `${element.field} = '${element.value}'`;
          }
          if (element.extraCondition) {
            con = `${element.field} ${element.extraCondition} '${element.value}'`;
          }
          whereStr.push(con)
        });
        var str1 = whereStr.join(" AND ");
        str = str + " WHERE " + str1
      }
      //str = str + ' ORDER by created_at DESC'
      if (params.pagination) {
        let offsetValue = (params.pagination.page * params.pagination.pageSize) - params.pagination.pageSize; //2 * 10 = 20 -10 = 10
        let limitSql = ` LIMIT ${params.pagination.pageSize} OFFSET ${offsetValue}`;
        str = str + limitSql
      }
      const finalSql = `SELECT ${params.select} FROM ${params.table} ${str} ORDER BY id DESC LIMIT 1`;
      console.log(finalSql);
      db.query(finalSql, function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}
/*End Last Record*/
/*module.exports.getRecords = function(params){
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      var whereStr = []
      var str = "";
      //where condition
      if(params.whereCon){
        params.whereCon.forEach(element => {
          var con = `${element.field} = '${element.value}'`;
          if(element.extraCondition){
            con = `${element.field} ${element.extraCondition} '${element.value}'`;
          }
          whereStr.push(con)
        });
        str = whereStr.join(" AND ");
        str = " WHERE " + str
      }

      if(params.pagination){
        let offsetValue = (params.pagination.page * params.pagination.pageSize) - params.pagination.pageSize; //2 * 10 = 20 -10 = 10
        let limitSql = ` LIMIT ${params.pagination.pageSize} OFFSET ${offsetValue}`;
        str = str + limitSql
      }
      const finalSql = `SELECT ${params.select} FROM ${params.table} ${str}`;
      
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
}*/

module.exports.check_duplicate = function (key, value, tableName, getKeyfromObject) {
  return new Promise((resolve, reject) => {
    if (getKeyfromObject) {
      value = value[getKeyfromObject];
      if (!value) {
        resolve('key_not_exist');
      }
    }
    var sql = `SELECT COUNT(${key}) as count FROM ${tableName} WHERE ${key} = ?`;

    connectDb.stablishedConnection().then((db) => {
      db.query(sql, [value], function (err, result, fields) {
        if (err) {

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

module.exports.insertRecords = function (insertData, tableName, isMultiple) {
  return new Promise((resolve, reject) => {
    var values = [], keys = [];

    if (isMultiple) {
      var keys1 = {}
      insertData.forEach(element => {
        keys1 = Object.keys(element)
        keys1 = "(" + keys1.toString() + ")";
        keys = keys1;
        values.push(Object.values(element))
      });
      keys = [keys]
    } else {
      keys = Object.keys(insertData)
      keys = "(" + keys.toString() + ")";
      values = [Object.values(insertData)]
    }

    var sql = `INSERT INTO ${tableName} ${keys} VALUES ?`;
    connectDb.stablishedConnection().then((db) => {
      db.query(sql, [values], function (err, result, fields) {
        if (err) {
          console.log("Error: ", err)
          reject(err);
        } else {
          result = result.insertId
          console.log("Record inserted successfully: ", result)
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}
/*module.exports.insertRecords = function(insertData, tableName){
  return new Promise((resolve, reject) => {
    var keys = Object.keys(insertData)
    keys = keys.toString();
    var values = Object.values(insertData)
    var sql = `INSERT INTO ${tableName}(${keys}) VALUES ?`;
    connectDb.stablishedConnection().then((db) => {
      db.query(sql, [[values]], function(err, result, fields){
        if(err){
          console.log("Error: ", err)
          reject(err);
        }else{
          result = result.insertId
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}*/
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
          console.log(err);
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

/*Academic data start*/
module.exports.getAcademicData = function (params) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      db.query(`SELECT id FROM academic_coventent WHERE user_id='${params}'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          console.log(result);
          return;
          connectDb.closeDbConnection(db);
          resolve(result);
          //callback(null, result);
        }
      });
    });
  });
}
/*Academic data end*/

/*Search Query*/
module.exports.getSearch = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      /*console.log(`SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND borrower_name  LIKE '%${searchKey}%'`)
      return;*/
      //SELECT po.*,poi.company_name FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE lender_id = '63' AND report_type = '1'

      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND borrower_name  LIKE '%${searchKey}%'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND po.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {

        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          console.log(result);
          return;
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getMasterLenderSearch = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      /*console.log(`SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND borrower_name  LIKE '%${searchKey}%'`)
      return;*/
      //SELECT po.*,poi.company_name FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE lender_id = '63' AND report_type = '1'

      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND borrower_name  LIKE '%${searchKey}%'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.master_lender_id = '${user_id}' AND po.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {

        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          console.log(result);
          return;
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getActiveSearch = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      /*console.log(`SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND borrower_name  LIKE '%${searchKey}%'`)
      return;*/
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND status = 1 AND borrower_name  LIKE '%${searchKey}%'
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND po.borrower_name  LIKE '%${searchKey}%'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND po.status = 1 AND po.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {

        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getActiveSearchMasterLender = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      /*console.log(`SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND borrower_name  LIKE '%${searchKey}%'`)
      return;*/
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND status = 1 AND borrower_name  LIKE '%${searchKey}%'
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND po.borrower_name  LIKE '%${searchKey}%'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND po.status = 1 AND po.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {

        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getInActiveSearch = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {

      db.query(`SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND status = 0 AND borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getInActiveSearchMasterLender = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {

      db.query(`SELECT * FROM anuual_report_master WHERE master_lender_id='${user_id}' AND status = 0 AND borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getSubmissionReports = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getSubmissionReportsForMasterLender = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.master_lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getSubmissionReportsForAdmin = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}


module.exports.getSubmissionReportsForSearchAdmin = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE (submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission') AND po.borrower_name  LIKE '%${searchKey}%' `, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getQuarterlySubmissionReports = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.quarterly_report_reminder_status = '1' OR po.status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getQuarterlySubmissionReportsAdmin = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.status = 'Pending' OR po.quarterly_report_reminder_status = '1' OR po.status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getQuarterlySubmissionReportsSearchAdmin = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE (po.status = 'Pending' OR po.quarterly_report_reminder_status = '1' OR po.status = 'Resubmission') AND ar.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}


module.exports.getInActiveLender = function (date) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      db.query(`SELECT * FROM users WHERE user_type = 'Lender' AND (last_login <= '${date}' OR last_login IS NULL )`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}



module.exports.getQuarterlySubmissionReportsMasterLender = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.quarterly_report_reminder_status = '1' OR po.status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}
module.exports.getAnnualBudgetSubmissionReports = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.annual_budget_report_reminder_status = '1' OR po.status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAnnualBudgetSubmissionReportsMasterLender = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.master_lender_id = '${user_id}' AND po.status = 'Pending' OR po.annual_budget_report_reminder_status = '1' OR po.status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}


module.exports.getAnnualBudgetSubmissionReportsAdmin = function () {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.status = 'Pending' OR po.annual_budget_report_reminder_status = '1' OR po.status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAnnualBudgetSubmissionReportsSearchAdmin = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Pending' OR quarterly_report_reminder_status = '1' OR quarterly_submission_status = 'Resubmission'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE (po.status = 'Pending' OR po.annual_budget_report_reminder_status = '1' OR po.status = 'Resubmission') AND ar.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getReviewReports = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Reviewed' OR submission_status = 'Under Review' OR submission_status = 'To be Review'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Reviewed' OR submission_status = 'Under Review' OR submission_status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getReviewReportsMasterLender = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Reviewed' OR submission_status = 'Under Review' OR submission_status = 'To be Review'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.master_lender_id = '${user_id}' AND submission_status = 'Reviewed' OR submission_status = 'Under Review' OR submission_status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getReviewReportsAdmin = function () {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Reviewed' OR submission_status = 'Under Review' OR submission_status = 'To be Review'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE submission_status = 'Reviewed' OR submission_status = 'Under Review' OR submission_status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getReviewReportsSearchAdmin = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Reviewed' OR submission_status = 'Under Review' OR submission_status = 'To be Review'
      /*console.log("SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE (submission_status = 'Reviewed' OR submission_status = 'Under Review' OR submission_status = 'To be Review') po.borrower_name  LIKE '%${searchKey}%'");
      return;*/
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE (submission_status = 'Reviewed' OR submission_status = 'Under Review' OR submission_status = 'To be Review') AND po.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getReviewQuarteryReports = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getReviewQuarteryReportsAdmin = function () {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getReviewQuarteryReportsSearchAdmin = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE (po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review') AND ar.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getReviewQuarteryReportsMasterLender = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.master_lender_id = '${user_id}' AND po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}
module.exports.getAnnualBudgetReviewReports = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAnnualBudgetReviewReportsMasterLender = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAnnualBudgetReviewReportsAdmin = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAnnualBudgetReviewReportsSearchAdmin = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE (po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review') AND  ar.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}
module.exports.getAnnualInsuranceReviewReports = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM interim_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAnnualInsuranceReviewReportsMasterLender = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM interim_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.master_lender_id = '${user_id}' AND po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAnnualInsuranceReviewReportsAdmin = function () {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM interim_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAnnualInsuranceReviewReportsSearchAdmin = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'

      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM interim_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE (po.status = 'Reviewed' OR po.status = 'Under Review' OR po.status = 'To be Review') AND ar.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}
module.exports.getAllReports = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'

      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllAdminReports = function () {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllSearchReports = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //  console.log(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE  (submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission') AND borrower_name  LIKE '%${searchKey}%'`);
      //return;
      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE  (submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission') AND borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllReportsMasterLender = function (user_id, searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'

      db.query(`SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.master_lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllRQuarterlyeports = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Resubmission' OR po.quarterly_report_reminder_status = '1'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllRQuarterlyeportsMasterLender = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.master_lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Resubmission' OR po.quarterly_report_reminder_status = '1'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllRQuarterlyeportsAdmin = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.status = 'Pending' OR po.status = 'Resubmission' OR po.quarterly_report_reminder_status = '1'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllRQuarterlyeportsSearchAdmin = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      /*console.log(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.status = 'Pending' OR po.status = 'Resubmission' OR po.quarterly_report_reminder_status = '1' AND ar.borrower_name  LIKE '%${searchKey}%'`);
      return;*/
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE (po.status = 'Pending' OR po.status = 'Resubmission' OR po.quarterly_report_reminder_status = '1') AND ar.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllAnnuaalBudgetReports = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Resubmission' OR po.annual_budget_report_reminder_status = '1'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllAnnuaalBudgetReportsMasterLender = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Resubmission' OR po.annual_budget_report_reminder_status = '1'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllAnnuaalBudgetReportsAdmin = function () {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'


      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id != po.report_id`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllAnnuaalBudgetReportsSearchAdmin = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE (po.status = 'Pending' OR po.status = 'Resubmission' OR po.annual_budget_report_reminder_status = '1') AND ar.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllInterimInsuranceReports = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM interim_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Resubmission' OR po.interim_report_reminder_status = '1'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllInterimInsuranceReportsAdmin = function () {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM interim_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id != po.report_id`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllInterimInsuranceReportsSearchAdmin = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM interim_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE (po.status = 'Pending' OR po.status = 'Resubmission' OR po.interim_report_reminder_status = '1') AND ar.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllInsuranceReports = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Resubmission' OR po.annual_budget_report_reminder_status = '1'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllInsuranceReportsMasterLender = function (user_id) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Resubmission' OR po.annual_budget_report_reminder_status = '1'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllInsuranceReportsAdmin = function () {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.status = 'Pending' OR po.status = 'Resubmission' OR po.annual_budget_report_reminder_status = '1'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getAllInsuranceReportsSearchAdmin = function (searchKey) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT * FROM anuual_report_master WHERE lender_id='${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      //SELECT po.*,poi.company_name,poi.company_logo FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND submission_status = 'Pending' OR reminder_status = '1' OR submission_status = 'Resubmission'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE (po.status = 'Pending' OR po.status = 'Resubmission' OR po.annual_budget_report_reminder_status = '1') AND ar.borrower_name  LIKE '%${searchKey}%'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}
module.exports.getSubmittedQuarterlyReports = function (user_id) {

  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review' 
      //SELECT po.*,poi.company_name FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE lender_id = '${user_id}' AND quarterly_submission_status = 'Pending'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Submitted' OR po.status = 'Reviewed' `, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}


module.exports.getSubmittedQuarterlyReportsAdmin = function (user_id) {

  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review' 
      //SELECT po.*,poi.company_name FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE lender_id = '${user_id}' AND quarterly_submission_status = 'Pending'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.status = 'Submitted' OR po.status = 'Reviewed' `, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getSubmittedQuarterlyReportsMasterLender = function (user_id) {

  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review'SELECT po.*,poi.company_name,poi.profile_image FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE po.lender_id = '${user_id}' AND quarterly_submission_status = 'Reviewed' OR quarterly_submission_status = 'Under Review' OR quarterly_submission_status = 'To be Review' 
      //SELECT po.*,poi.company_name FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE lender_id = '${user_id}' AND quarterly_submission_status = 'Pending'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM quarterly_reviewed_report po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.master_lender_id = '${user_id}' AND po.status = 'Submitted' OR po.status = 'Reviewed' `, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}
module.exports.getSubmittedAnnualBudget = function (user_id) {

  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //   
      //SELECT po.*,poi.company_name FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE lender_id = '${user_id}' AND quarterly_submission_status = 'Pending'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Reviewed'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getSubmittedAnnualBudgetMasterLender = function (user_id) {

  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //   
      //SELECT po.*,poi.company_name FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE lender_id = '${user_id}' AND quarterly_submission_status = 'Pending'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM annual_budget_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Reviewed'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getSubmittedInterimReport = function (user_id) {

  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //   
      //SELECT po.*,poi.company_name FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE lender_id = '${user_id}' AND quarterly_submission_status = 'Pending'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM interim_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Reviewed'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}


module.exports.getSubmittedInterimReportMasterLender = function (user_id) {

  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      //   
      //SELECT po.*,poi.company_name FROM anuual_report_master po LEFT JOIN users poi ON po.user_id = poi.id WHERE lender_id = '${user_id}' AND quarterly_submission_status = 'Pending'
      db.query(`SELECT ar.*,poi.company_name,poi.company_logo FROM interim_report_reviewed po LEFT JOIN users poi ON po.borrower_id = poi.id LEFT JOIN anuual_report_master ar ON ar.id = po.report_id WHERE po.master_lender_id = '${user_id}' AND po.status = 'Pending' OR po.status = 'Reviewed'`, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });

  });
}

module.exports.getQuestion = function (params) {

  return new Promise((resolve, reject) => {
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

    const finalSql = `SELECT * FROM ${params.table} ${str}`;
    console.log(finalSql);
    connectDb.stablishedConnection().then((db) => {
      db.query(finalSql, function (err, result, fields) {
        if (err) {
          //callback(err, null);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
          //return;
          /*console.log(result);
          return;*/
          //callback(null, result);
        }
      });
    });
  });
}

/*End Search Query*/
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

module.exports.getUser = function (params, callback) {
  connectDb.stablishedConnection().then((db) => {
    var whereStr = []
    var str = "";

    if (params.whereCon) {
      params.whereCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
    }

    if (params.whereOrCon) {
      params.whereOrCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" OR ");
    }

    if (params.whereCon || params.whereOrCon) {
      str = " WHERE " + str
    }

    db.query(`SELECT * FROM users ${str} order by created_at DESC`, function (err, result, fields) {
      if (err) {
        console.log("Error: ", err)
        callback(err, null);
      } else {
        result = JSON.parse(JSON.stringify(result));
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}







module.exports.getLender = function (params, callback) {

  connectDb.stablishedConnection().then((db) => {
    var whereStr = []
    var str = "";

    if (params.whereCon) {
      params.whereCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
    }

    if (params.whereOrCon) {
      params.whereOrCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" OR ");
    }

    if (params.whereCon || params.whereOrCon) {
      str = " WHERE " + str
    }

    db.query(`SELECT * FROM lender_details ${str} order by created_at DESC`, function (err, result, fields) {
      if (err) {
        console.log("Error: ", err)
        return;
        callback(err, null);
      } else {
        result = JSON.parse(JSON.stringify(result));
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}


module.exports.getDealOwner = function (params, callback) {

  connectDb.stablishedConnection().then((db) => {
    var whereStr = []
    var str = "";

    if (params.whereCon) {
      params.whereCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
    }

    if (params.whereOrCon) {
      params.whereOrCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" OR ");
    }

    if (params.whereCon || params.whereOrCon) {
      str = " WHERE " + str
    }

    db.query(`SELECT * FROM deal_ownwer_details ${str} order by created_at DESC`, function (err, result, fields) {
      if (err) {
        console.log("Error: ", err)
        return;
        callback(err, null);
      } else {
        result = JSON.parse(JSON.stringify(result));
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}


module.exports.getUserByEmail = function (params) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      var whereStr = []
      var joinStr = []
      var str = "";
      var joinQuery = ''
      //Join condition

      //where condition
      if (params.whereCon) {
        params.whereCon.forEach(element => {
          var con = ''
          if (element.value == 'NULL') {
            con = `${element.field} IS NULL`
          } else {
            con = `${element.field} = '${element.value}'`;
          }
          if (element.extraCondition) {
            con = `${element.field} ${element.extraCondition} '${element.value}'`;
          }
          whereStr.push(con)
        });
        var str1 = whereStr.join(" OR ");
        str = str + " WHERE " + str1
      }
      const finalSql = `SELECT ${params.select} FROM ${params.table} ${str}`;

      console.log(finalSql);
      db.query(finalSql, function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}

module.exports.getConfigureBorrower = function (params) {
  return new Promise((resolve, reject) => {
    connectDb.stablishedConnection().then((db) => {
      var whereStr = []
      var joinStr = []
      var str = "";
      var joinQuery = ''
      //Join condition

      //where condition
      if (params.whereCon) {
        params.whereCon.forEach(element => {
          var con = ''
          if (element.value == 'NULL') {
            con = `${element.field} IS NULL`
          } else {
            con = `${element.field} = '${element.value}'`;
          }
          if (element.extraCondition) {
            con = `${element.field} ${element.extraCondition} '${element.value}'`;
          }
          whereStr.push(con)
        });
        var str1 = whereStr.join(" OR ");
        str = str + " WHERE " + str1
      }
      const finalSql = `SELECT ${params.select} FROM ${params.table} ${str}`;

      console.log(finalSql);
      db.query(finalSql, function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          result = JSON.parse(JSON.stringify(result));
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
}





module.exports.sendEmail = function (mailOptions, callback) {
  var transporter = nodemailer.createTransport({
    //host: "smtp.gmail.com",
    //port: 587,
    service: 'gmail',
    auth: {
      user: "effhelp767@gmail.com",
      pass: "Dhawal@12345"
    }
  });

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      //console.log(err);
      callback(err, null);
      return;
    } else {
      /*console.log("true");
      return;*/
      callback(null, true);
      return;
    }
  });
}

/*module.exports.sendEmail = function(params){
  var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "2b01cc990bbaf6",
    pass: "a50efacd4016c9"
  }
});
}*/


