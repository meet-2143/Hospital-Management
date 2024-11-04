'use strict';
const connectDb = require('../db/dbConnection')
const config = require('./../config');

module.exports.sendMessage = function(params, callback){
    var keys = Object.keys(params)
    keys = keys.toString();
    var values = Object.values(params)
    var sql = "INSERT INTO messages("+keys+") VALUES ?";
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

module.exports.messageRoom = function(params, callback){
    connectDb.stablishedConnection().then((db) => {
        const sql = `select MSG.id, MSG.sender_id, MSG.receiver_id, MSG.message, max(MSG.created_at) as maxDate, concat(USR.first_name," ", USR.middle_name, " ", USR.last_name) as receiverName, concat(USR_SEND.first_name," ", USR_SEND.middle_name, " ", USR_SEND.last_name) as senderName,  CONCAT("${config.base_url}","public/images/users/profiles/",USR_SEND.profile_image) as senderProfileImage, CONCAT("${config.base_url}","public/images/users/profiles/",USR.profile_image) as receiverProfileImage, (select count(*) as cnt FROM messages WHERE receiver_id = '${params.id}' AND read_status = 0 AND sender_id = MSG.sender_id) as unreadCount
        FROM messages MSG
        LEFT JOIN users USR ON MSG.receiver_id = USR.id 
        LEFT JOIN users USR_SEND ON MSG.sender_id = USR_SEND.id 
        WHERE MSG.sender_id='${params.id}' OR MSG.receiver_id='${params.id}' group by MSG.sender_id, MSG.receiver_id order by maxDate desc`;
        console.log(sql);
        db.query(sql, function(err, result, fields){
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

module.exports.loadUserMessages = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
      db.query(`select MSG.id, MSG.sender_id, MSG.created_at as maxDate, MSG.receiver_id, MSG.message, concat(USR.first_name," ", USR.middle_name, " ", USR.last_name) as receiverName, concat(USR_SEND.first_name," ", USR_SEND.middle_name, " ", USR_SEND.last_name) as senderName,  CONCAT("${config.base_url}","public/images/users/profiles/",USR_SEND.profile_image) as senderProfileImage, CONCAT("${config.base_url}","public/images/users/profiles/",USR.profile_image) as receiverProfileImage
        FROM messages MSG 
        LEFT JOIN users USR ON MSG.receiver_id = USR.id 
        LEFT JOIN users USR_SEND ON MSG.sender_id = USR_SEND.id 
        WHERE (MSG.sender_id='${params.id}' AND MSG.receiver_id='${params.receiver_id}') OR (MSG.receiver_id='${params.id}' AND MSG.sender_id='${params.receiver_id}') order by maxDate ASC`, function(err, result, fields){
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

module.exports.readMessage = function(params, callback){
    connectDb.stablishedConnection().then((db) => {
        db.query(`select MSG.id, MSG.sender_id, MSG.created_at as maxDate, MSG.receiver_id, MSG.message, concat(USR.first_name," ", USR.middle_name, " ", USR.last_name) as receiverName, '${params.senderName}' as senderName,  CONCAT("${config.base_url}","public/images/users/profiles/",'${params.senderProfileImage}')  as senderProfileImage, CONCAT("${config.base_url}","public/images/users/profiles/",USR.profile_image) as receiverProfileImage
          FROM messages MSG 
          LEFT JOIN users USR ON MSG.receiver_id = USR.id 
          WHERE MSG.sender_id='${params.id}' AND MSG.receiver_id='${params.receiver_id}' order by maxDate ASC`, function(err, result, fields){
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