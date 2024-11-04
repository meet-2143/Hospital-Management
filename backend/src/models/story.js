'use strict';
const connectDb = require('../db/dbConnection')
const config = require('./../config');

module.exports.getTop10story = function(params, callback){
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

    db.query(`SELECT *,CONCAT('${config.base_url}' , 'public/images/users/story/',images) as images FROM stories ${str} limit 10`, function(err, result, fields){
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

module.exports.getStories = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    db.query(`SELECT *, DATE_FORMAT(wedding_date,'%d, %M %Y') AS wedding_date  FROM stories`, function(err, result, fields){
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

module.exports.getStoriesById = function(params, callback){
    connectDb.stablishedConnection().then((db) => {
      //var sql = `SELECT *, DATE_FORMAT(created_at,'%d, %M %Y') AS storyDate  FROM stories WHERE id = ${params.id}`;
      //var sql = `SELECT *, DATE_FORMAT(wedding_date,'%Y-%m-%d') AS wedding_date, DATE_FORMAT(first_meet_date,'%Y-%m-%d') AS first_meet_date FROM stories WHERE id = ${params.id}`;
      var sql = `SELECT id, user_id, title, member_name, partner_name, member_email, partner_email, story_description, status, DATE_FORMAT(first_meet_date,'%Y-%m-%d') AS first_meet_date, DATE_FORMAT(wedding_date,'%Y-%m-%d') AS wedding_date, CONCAT('${config.base_url}' , 'public/images/users/story/',images) as url, images, modified_at FROM stories WHERE id = ${params.id}`;
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

module.exports.insertStory = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  var values = Object.values(params)
  var sql = "INSERT INTO stories("+keys+") VALUES ?";
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

module.exports.updateStory = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  let update_set = Object.keys(params).map(value=>{
    return ` ${value}  = "${params[value]}"`;
  });

  let update_query =  `UPDATE stories SET ${update_set.join(" ,")} WHERE id = "${params.id}"`;
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

module.exports.deleteStory = function(params, callback){
  if(params.toString() != ""){
    let query =  `DELETE FROM stories WHERE id IN ("${params.toString()}")`;
    console.log(query);
    connectDb.stablishedConnection().then((db) => {
      db.query(query, function(err, result, fields){
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
  }else{
    callback("Records not found to delete.", null);
  }
}