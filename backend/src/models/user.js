'use strict';
const connectDb = require('../db/dbConnection')
const config = require('./../config');

/**Sansar Vivah APIs start */
module.exports.getDashboardCounts = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    db.query(`SELECT (SELECT COUNT(*) as active FROM users WHERE gender = 'female') as active, (SELECT COUNT(*) as inactive FROM users WHERE gender = 'male') as inactive FROM users limit 1`, function(err, result, fields){
      if(err){
        callback(err, null);
      }else{
        result = JSON.parse(JSON.stringify(result));
        db.query(`SELECT (SELECT COUNT(*) as published FROM stories WHERE status = 'Published') as published, (SELECT COUNT(*) as pending FROM stories WHERE status = 'Pending') as pending FROM stories limit 1`, function(err, result1, fields){
          if(err){
            callback(err, null);
          }else{
            result1 = JSON.parse(JSON.stringify(result1));
            connectDb.closeDbConnection(db);
            callback(null, {members: result[0], story: result1[0]});
          }
        });
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
    }

    if(params.whereOrCon){
      params.whereOrCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" OR ");
    }
    
    if(params.whereCon || params.whereOrCon){
      str = " WHERE " + str
    }

    db.query(`SELECT * FROM users ${str} order by created_at DESC`, function(err, result, fields){
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

module.exports.getMemberList = function(params, callback){
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
    
    // Membership Status(Active/Expired), Membership Started On, Plan Name 
    db.query(`SELECT id as srno, id, first_name, middle_name, last_name, CASE WHEN gender = "Male" THEN "Groom" ELSE "Bride" END as brideGroom, username, mobile_number, email, show_password, status, DATE_FORMAT(USR.created_at,'%d-%M-%y') as registredAt, (SELECT plan_name FROM payments WHERE user_id = USR.id AND status = 'Success' ORDER BY created_at DESC LIMIT 1) as plan_name, (SELECT DATE_FORMAT(created_at,'%d-%M-%y') FROM payments WHERE user_id = USR.id AND status = 'Success' ORDER BY created_at DESC LIMIT 1) as membership_start_on, (SELECT DATE_FORMAT(expired_at,'%d-%M-%y') FROM payments WHERE user_id = USR.id AND status = 'Success' ORDER BY created_at DESC LIMIT 1) as membership_expired_on, ( SELECT CASE WHEN expired_at > now() THEN "Active" WHEN expired_at < now() THEN "Expired" ELSE "Unpaid Member" END FROM payments WHERE user_id = USR.id AND status = 'Success' ORDER BY created_at DESC LIMIT 1 ) AS membershipStatus FROM users USR ${str} order by created_at DESC`, function(err, result, fields){
      if(err){
        console.log("Error: ",err)
        callback(err, null);
      }else{
        result = JSON.parse(JSON.stringify(result));
        if(result.length > 0){
          var j=0
          result.forEach((element,i) => {
            element.srno = ++j;
            if(element.membershipStatus == null){
              element.membershipStatus = "Unpaid Member";
            }
            if(element.plan_name == null){
              element.plan_name = "-";
            }
            if(element.membership_start_on == null){
              element.membership_start_on = "-";
            }
            result[i] = element;
          });
        }

        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.getWelcomeMessage = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    
    db.query(`SELECT * FROM settings limit 1`, function(err, result, fields){
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

module.exports.getTop10user = function(params, callback){
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

    db.query(`SELECT id, first_name, middle_name, last_name, CONCAT('${config.base_url}' , 'public/images/users/profiles/',profile_image) as profile_image FROM users ${str}  ORDER BY created_at DESC limit 10`, function(err, result, fields){
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

module.exports.getUserProfile2 = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    var whereStr = []
    var str = "";
    let intrst = '';
    let shrtlst = '';
    
    if(params.userId){
      intrst = `(
        SELECT count(*) AS total
        FROM   user_interest WHERE senderId = ${params.userId} AND receiverId = usr.id
      ) AS  isInterested`;
      shrtlst = `(
        SELECT count(*) AS total1
        FROM   user_shortlist WHERE senderId = ${params.userId} AND receiverId = usr.id
      ) AS  isShortlisted`;
    }else{
      intrst = `0 AS isInterested`;
      shrtlst = `0 AS isShortlisted`;
    }

    if(params.whereCon){
      params.whereCon.forEach(element => {
        var con = `${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
      str = " WHERE " + str
    }

    db.query(`SELECT usr.*,CONCAT('${config.base_url}' , 'public/images/users/profiles/',usr.profile_image) as profile_image, CONCAT('${config.base_url}' , 'public/images/users/pan/',usr.pan_card) as pan_card, CONCAT('${config.base_url}' , 'public/images/users/aadhar/',usr.aadhar_card) as aadhar_card, CONCAT('${config.base_url}' , 'public/images/users/astro/',usr.astro_profile) as astro_profile, ${intrst}, ${shrtlst} FROM users usr ${str} limit 1`, function(err, result, fields){
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
module.exports.getUserProfile = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    var whereStr = []
    var str = "";
    let intrst = '';
    let shrtlst = '';
    
    if(params.userId){
      intrst = `(
        SELECT count(*) AS total
        FROM   user_interest WHERE senderId = ${params.userId} AND receiverId = usr.id
      ) AS  isInterested`;
      shrtlst = `(
        SELECT count(*) AS total1
        FROM   user_shortlist WHERE senderId = ${params.userId} AND receiverId = usr.id
      ) AS  isShortlisted`;
    }else{
      intrst = `0 AS isInterested`;
      shrtlst = `0 AS isShortlisted`;
    }

    if(params.whereCon){
      params.whereCon.forEach(element => {
        var con = `usr.${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
      str = " WHERE " + str
    }
    var sqlObj = `SELECT usr.*, DATE_FORMAT(usr.date_of_birth, '%d-%m-%Y') as myDateOfBirth, CONCAT('${config.base_url}' , 'public/images/users/profiles/',usr.profile_image) as profile_image, CONCAT('${config.base_url}' , 'public/images/users/pan/',usr.pan_card) as pan_card, CONCAT('${config.base_url}' , 'public/images/users/aadhar/',usr.aadhar_card) as aadhar_card, CONCAT('${config.base_url}' , 'public/images/users/astro/',usr.astro_profile) as astro_profile, ${intrst}, ${shrtlst}, RLG.name as religionName, CST.caste_name as casteName, usr.sub_caste_id as subCasteName, MTR.name as motherToungeName, EDU.name as educationName, EDU_PRTNR.name as partnerEducation, OCPTN.occupation_name as occupationName
    FROM users usr 
    LEFT JOIN religions RLG
      ON usr.religion_id = RLG.id 
    LEFT JOIN caste_lists CST
      ON usr.caste_id = CST.id AND CST.type ="caste"
    LEFT JOIN mother_tongue MTR
      ON usr.mother_tounge_id = MTR.id
    LEFT JOIN education_list EDU 
      ON usr.education_field_id = EDU.id
    LEFT JOIN education_list EDU_PRTNR 
      ON usr.education_pp = EDU_PRTNR.id
    LEFT JOIN occupation_list OCPTN 
      ON usr.occupation = OCPTN.id
  ${str} limit 1`;
  console.log(sqlObj);
    db.query(sqlObj, function(err, result, fields){
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

module.exports.isBuyedContact = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    var str = ` WHERE viewedById = ${params.viewedById} AND viewedToId = ${params.viewedToId}`;
    db.query(`SELECT count(*) as isBuyed FROM view_contact_details ${str}`, function(err, result, fields){
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

module.exports.getMyViewedHistory = function(params, callback){
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
    var whereStr = []
    var str = "";

    if(params.whereCon){
      params.whereCon.forEach(element => {
        var con = `VCD.${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
      str = " WHERE " + str
    }
    var sql1 = `( SELECT count(*) as cnt  FROM view_contact_details VCD ${str} ) as trValue`;
    var sql2 = `SELECT "" as srno, VCD.viewedToId as userId, RT.username, CONCAT(RT.first_name," ", middle_name, " ",last_name) as name, RT.email, DATE_FORMAT(VCD.updated_at, '%d-%m-%Y') as date, DATE_FORMAT(VCD.updated_at,'%H:%i:%s') as time, ${sql1}
      FROM view_contact_details VCD 
      LEFT JOIN users RT ON VCD.viewedToId = RT.id 
      ${str} ${limit}`;
    db.query(sql2, function(err, result, fields){
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

module.exports.getMemberPaymentList = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    var sql2 = `SELECT *, DATE_FORMAT(expired_at,'%d-%M-%y') as expiredAt FROM payments WHERE user_id = ${params.id} AND status NOT IN ('Created','Failed') ORDER BY updated_at DESC`;
    db.query(sql2, function(err, result, fields){
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

module.exports.getSearchData = function(params, callback){
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
    var whereStr = []
    var str = "";
    var second_where = "";
    const search = params.search;
    var con = ''
    if(search){
      const searchKey = Object.keys(search);
      if(Object.keys(search).length === 0){
        //nothing
      }else{
        searchKey.forEach(element => {
          switch (element){
            case 'gender':
              second_where = `usr.gender = ${search[element]} `;
              whereStr.push(second_where)
              break;
            case 'oppositeGender':
              second_where = `usr.gender != '${search[element]}' `;
              whereStr.push(second_where)
              break;
            case 'age':
              second_where = ` ( usr.age BETWEEN '${search[element]['min']}' AND '${search[element]['max']}' )`
              whereStr.push(second_where)
              break;
            case 'height':
              second_where = ` ( usr.height BETWEEN '${search[element]['min']}' AND '${search[element]['max']}' )`;
              whereStr.push(second_where)
              break;
            default:
              if(search[element].length > 0){
                con = `usr.${element} = '${search[element]}'`
                whereStr.push(con)
              }
              break;
          }
        });
        str = whereStr.join(" AND ");
        str = " WHERE " + str //+ second_where
      }
    }

    var sql = "";
    let intrst = '';
    let shrtlst = '';
    let notIn = "";
    let viewContact = "";
    
    if(params.userId){
      if(str == ""){
        notIn = " WHERE usr.id NOT IN("+params.userId+") ";
      }else{
        notIn = " AND usr.id NOT IN("+params.userId+") ";
      }

      intrst = `(
        SELECT count(*) AS total
        FROM   user_interest WHERE senderId = ${params.userId} AND receiverId = usr.id
      ) AS  isInterested`;

      shrtlst = `(
        SELECT count(*) AS total1
        FROM   user_shortlist WHERE senderId = ${params.userId} AND receiverId = usr.id
      ) AS  isShortlisted`;

      viewContact = `(
        SELECT count(*) AS viewCount
        FROM view_contact_details WHERE viewedById = ${params.userId} AND viewedToId = usr.id
      ) AS  isViewCount`;

    }else{
      intrst = `0 AS isInterested`;
      shrtlst = `0 AS isShortlisted`;
      viewContact = `0 AS isViewCount`
    }
    if(!params.ignoreLimit){
      sql = `
        SELECT usr.id, usr.username, usr.age, usr.height, usr.maritial_status, usr.annual_income, usr.native_place_details, usr.native_village, usr.native_taluka, usr.native_district, usr.country_id, usr.state_id, usr.city_id, usr.education_level, RLG.name as religionName, CST.caste_name as casteName, usr.sub_caste_id as subCaste, CONCAT('${config.base_url}' , 'public/images/users/profiles/',usr.profile_image) as profile_image, usr.first_name,  usr.middle_name,  usr.last_name,  MTR.name as montheTongueName, OCCU.occupation_name as occupationName, ${intrst}, ${shrtlst}, ${viewContact}   
          FROM users usr 
          LEFT JOIN religions RLG
            ON usr.religion_id = RLG.id 
          LEFT JOIN caste_lists CST
            ON usr.caste_id = CST.id AND CST.type ="caste"
          LEFT JOIN mother_tongue MTR
            ON usr.mother_tounge_id = MTR.id
          LEFT JOIN occupation_list OCCU
            ON usr.occupation = OCCU.id  
        ${str} 
        ${notIn} 
        ORDER BY usr.created_at DESC
        `;
      if(limit){ sql += limit }
    }else{
      sql = `SELECT count(*) as allUsers FROM users usr ${str}  ${notIn} `;
    }
    console.log(sql,"___anilsaini")
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

module.exports.getShortlisted = function(params, callback){
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
    var whereStr = []
    var str = "";
    let intrst = '';
    
    if(params.userId){
      intrst = `(
        SELECT count(*) AS total
        FROM   user_interest WHERE senderId = ${params.userId} AND receiverId = RT.id
      ) AS  isInterested`;
    }else{
      intrst = `0 AS isInterested`;
    }

    if(params.whereCon){
      params.whereCon.forEach(element => {
        var con = `LT.${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
      str = " WHERE " + str
    }
    var sql1 = `( SELECT count(*) as cnt  FROM user_shortlist LT LEFT JOIN users RT ON LT.receiverId = RT.id ${str} ) as totalRecords`;
    var sql2 = `SELECT LT.receiverId as id, LT.receiverId, CONCAT(RT.first_name," ", middle_name, " ",last_name) as name, CONCAT('${config.base_url}' , 'public/images/users/profiles/',RT.profile_image) as profile_image, RT.age, RLI.name as religion, "Ahmedabad" as location, MTR.name as monthertoungem, ${sql1}, ${intrst}
      FROM user_shortlist LT 
      LEFT JOIN users RT ON LT.receiverId = RT.id 
      LEFT JOIN religions RLI ON RT.religion_id = RLI.id
      LEFT JOIN mother_tongue MTR ON RT.mother_tounge_id = MTR.id
      ${str} ${limit}`;
    console.log("_____",sql2,"________________________");
    db.query(sql2, function(err, result, fields){
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

module.exports.getShortlistedUsers = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    var sql2 = `SELECT CONCAT(OT.first_name," ", OT.middle_name, " ", OT.last_name) as shortlistedBy, CONCAT(RT.first_name," ", RT.middle_name, " ", RT.last_name) as shortlistedTo, RT.age, RLI.name as religion, "Ahmedabad" as location, MTR.name as monthertounge
      FROM user_shortlist LT 
      LEFT JOIN users RT ON LT.receiverId = RT.id 
      LEFT JOIN users OT ON LT.senderId = OT.id 
      LEFT JOIN religions RLI ON RT.religion_id = RLI.id
      LEFT JOIN mother_tongue MTR ON RT.mother_tounge_id = MTR.id ORDER BY OT.id`;

    db.query(sql2, function(err, result, fields){
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

module.exports.getMyInterest = function(params, callback){
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
    var whereStr = []
    var str = "";
    if(params.whereCon){
      params.whereCon.forEach(element => {
        var con = `LT.${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
      str = " WHERE " + str
    }
    var sql1 = `( SELECT count(*) as cnt FROM user_interest LT LEFT JOIN users RT ON LT.receiverId = RT.id ${str} ) as totalRecords`;
    var sql2 = `SELECT LT.id, LT.receiverId, CONCAT(RT.first_name," ", middle_name, " ",last_name) as name, CONCAT('${config.base_url}' , 'public/images/users/profiles/',RT.profile_image) as profile_image, RT.age, RLI.name as religion, "Ahmedabad" as location, MTR.name as monthertounge, LT.status, ${sql1}  
      FROM user_interest LT 
      LEFT JOIN users RT ON LT.receiverId = RT.id 
      LEFT JOIN religions RLI ON RT.religion_id = RLI.id
      LEFT JOIN mother_tongue MTR ON RT.mother_tounge_id = MTR.id
      ${str}  ${limit}`;

    db.query(sql2, function(err, result, fields){
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

module.exports.getInterestedUsers = function(params, callback){
  connectDb.stablishedConnection().then((db) => {
    var sql2 = `SELECT LT.id, CONCAT(OT.first_name," ", OT.middle_name, " ", OT.last_name) as interestShownBy, CONCAT(RT.first_name," ", RT.middle_name, " ",RT.last_name) as interestShownIn, RT.age, RLI.name as religion, "Ahmedabad" as location, MTR.name as monthertounge, LT.status
      FROM user_interest LT 
      LEFT JOIN users RT ON LT.receiverId = RT.id 
      LEFT JOIN users OT ON LT.senderId = OT.id 
      LEFT JOIN religions RLI ON RT.religion_id = RLI.id
      LEFT JOIN mother_tongue MTR ON RT.mother_tounge_id = MTR.id ORDER BY OT.id`;

    db.query(sql2, function(err, result, fields){
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

module.exports.getInterestRequest = function(params, callback){
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
    var whereStr = []
    var str = "";
    if(params.whereCon){
      params.whereCon.forEach(element => {
        var con = `LT.${element.field} = '${element.value}'`
        whereStr.push(con)
      });
      str = whereStr.join(" AND ");
      str = " WHERE " + str
    }
    var sql1 = `( SELECT count(*) as cnt FROM user_interest LT LEFT JOIN users RT ON LT.senderId = RT.id ${str} ) as totalRecords`;
    var sql2 = `SELECT LT.id,LT.receiverId, RT.username as memberId,  RT.first_name as name, CONCAT('${config.base_url}' , 'public/images/users/profiles/',RT.profile_image) as profile_image, RT.age, RLI.name as religion, "Ahmedabad" as location, MTR.name as monthertounge, LT.status, ${sql1}
      FROM user_interest LT 
      LEFT JOIN users RT ON LT.senderId = RT.id 
      LEFT JOIN religions RLI ON RT.religion_id = RLI.id
      LEFT JOIN mother_tongue MTR ON RT.mother_tounge_id = MTR.id 
      ${str} ${limit}`;
    db.query(sql2, function(err, result, fields){
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

module.exports.addShortlist = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  var values = Object.values(params)
  var sql = "INSERT INTO user_shortlist("+keys+") VALUES ?";
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
};

module.exports.removeShortlist = function(params, callback){
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
    db.query(`DELETE FROM user_shortlist ${str}`, function(err, result, fields){
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

module.exports.addInterestlist = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  var values = Object.values(params)
  var sql = "INSERT INTO user_interest("+keys+") VALUES ?";
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
};

module.exports.register_user = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  var values = Object.values(params)
  var sql = "INSERT INTO users("+keys+") VALUES ?";
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
};

module.exports.user_update = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  let update_set = Object.keys(params).map(value=>{
    if(params[value] == 'null'){
      return ` ${value}  = NULL`;
    }else{
      return ` ${value}  = "${params[value]}"`;
    }
  });

  let update_query =  `UPDATE users SET ${update_set.join(" ,")} WHERE id = "${params.id}" `;
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

/**
 * Please remove this function from here
 */
module.exports.check_duplicate1 = function(key, value){
  return new Promise((resolve, reject) => {
    var sql = "SELECT COUNT("+key+") as count FROM users WHERE "+key+" = ?";
    connectDb.stablishedConnection().then((db) => {
      db.query(sql, [value], function(err, result, fields){
        if(err){
          console.log(err)
          reject(err);
        }else{
          result = JSON.parse(JSON.stringify(result))
          result = result[0].count
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
  
}

module.exports.check_duplicate_edit = function(key, value, id){
  return new Promise((resolve, reject) => {
    var sql = "SELECT COUNT("+key+") as count FROM users WHERE "+key+" = '"+value+"' AND id != '"+id+"'";    
    connectDb.stablishedConnection().then((db) => {
      db.query(sql, function(err, result, fields){
        if(err){
          console.log(err)
          reject(err);
        }else{
          result = JSON.parse(JSON.stringify(result))
          result = result[0].count
          connectDb.closeDbConnection(db);
          resolve(result);
        }
      });
    });
  });
  
}

module.exports.insertGalleryImages = function(params, callback){
  var values = [];
  params.forEach(element => {
    values.push(Object.values(element))
  });  
  var sql = "INSERT INTO user_gallery(user_id, image_name) VALUES ?";
  connectDb.stablishedConnection().then((db) => {
    db.query(sql, [values], function(err, result, fields){
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

module.exports.getMyGallery = function(params, callback){
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

    db.query(`SELECT id, user_id, CONCAT("${config.base_url}","public/images/users/gallery/",image_name) as image_name FROM user_gallery ${str}`, function(err, result, fields){
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
module.exports.addViewContact = function(params, callback){
  var keys = Object.keys(params)
  keys = keys.toString();
  var values = Object.values(params)
  var sql = "INSERT INTO view_contact_details("+keys+") VALUES ?";
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
};

module.exports.getActivePlan = function(params, callback){
  var sql = `SELECT id, remaining_contact_view_limit, expired_at FROM payments WHERE status = 'Success' AND user_id = ${params.id} ORDER BY created_at DESC LIMIT 1`;
  connectDb.stablishedConnection().then((db) => {
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

module.exports.getDeleteGalleryImage = function(params, callback){
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

  var sql = `DELETE FROM user_gallery ${str}`;
  console.log(sql);
  connectDb.stablishedConnection().then((db) => {
    db.query(sql, function(err, result, fields){
      if(err){
        console.log(err)
        callback(err, null);
      }else{
        connectDb.closeDbConnection(db);
        callback(null, result);
      }
    });
  });
}

module.exports.getUserRelations = function(params, callback){
    var sqlObj = `SELECT count(usr.id) as count
      FROM users usr 
      RIGHT JOIN view_contact_details VCD
        ON (usr.id = VCD.viewedById) || (usr.id = VCD.viewedToId) 
      RIGHT JOIN user_shortlist US
        ON (usr.id = US.senderId) || (usr.id = US.receiverId) 
      RIGHT JOIN user_interest UI
        ON (usr.id = UI.senderId) || (usr.id = UI.receiverId) 
      RIGHT JOIN payments PMT
        ON usr.id = PMT.user_id AND PMT.status = "Success"
      RIGHT JOIN messages MSG 
        ON (usr.id = MSG.sender_id) || (usr.id = MSG.receiver_id) 
      WHERE usr.id = ${params.id}
      `;
  connectDb.stablishedConnection().then((db) => {
    db.query(sqlObj, function(err, result, fields){
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


module.exports.deleteUser = function(params, callback){
  var sqlObj = `DELETE FROM users WHERE  id = ${params.id}`;
  connectDb.stablishedConnection().then((db) => {
    db.query(sqlObj, function(err, result, fields){
      if(err){
        callback(err, null);
      }else{
        connectDb.closeDbConnection(db);
        callback(null, true);
      }
    });
  });
}

module.exports.getUsersForExport = function(params, callback){
    var sqlObj = `SELECT usr.id, usr.first_name, usr.middle_name, usr.last_name, usr.username, usr.show_password, usr.email, usr.mobile_number, usr.contact_number, usr.alternate_contact_number1, usr.alternate_contact_number2, usr.profile_submitted_by, usr.contact_person_name, usr.address, usr.age, usr.maritial_status, usr.have_children, usr.no_of_children_basic, usr.hobbies_intrest, usr.about_me, usr.height, usr.weight, usr.blood_group, usr.gender, usr.complexion_attr, usr.body_type, CASE WHEN usr.spectacles = 1 THEN "Yes" ELSE "No" END as spectacles, CASE WHEN usr.lenses = 1 THEN "Yes" ELSE "No" END as lenses, usr.smoke, usr.drink, usr.diet, usr.physical_status, usr.disabled_reason, usr.education_name, usr.education_level, usr.working_with_company, usr.monthly_income, usr.annual_income, usr.employed_in, usr.date_of_birth, usr.birth_time, usr.place_of_birth, usr.rashi, usr.name_as_rashi, usr.nakshatra, usr.nadi, usr.devak, usr.gan, usr.charan, usr.gotra, CASE WHEN usr.mangal = 1 THEN "Yes" ELSE "No" END as mangal, CASE WHEN usr.believe_in_horoscopes = 1 THEN "Yes" ELSE "No" END as believe_in_horoscopes, CONCAT('${config.base_url}' , 'public/images/users/profiles/',usr.profile_image) as profile_image, CONCAT('${config.base_url}' , 'public/images/users/pan/',usr.pan_card) as pan_card, CONCAT('${config.base_url}' , 'public/images/users/aadhar/',usr.aadhar_card) as aadhar_card, CONCAT('${config.base_url}' , 'public/images/users/astro/',usr.astro_profile) as astro_profile, usr.sub_caste_id, usr.specify_caste, usr.family_value, usr.family_status, usr.family_type, usr.father_name, usr.father_occupation, usr.mother_name, usr.mother_occupation, usr.no_of_brothers, usr.married_brothers, usr.no_of_sisters, usr.married_sisters, usr.family_wealth_detail, usr.mothers_brother_father_name, usr.mothers_brother_father_address, usr.relatives_details, usr.current_residence, usr.full_address, usr.pin_code, usr.country_id, usr.state_id, usr.city_id, usr.residence_status, usr.native_village, usr.native_taluka, usr.native_district, usr.height_pp, usr.height_to_pp, usr.weight_pp, usr.education_pp, usr.maritial_status_pp, usr.have_children_pp, usr.profession, usr.salary_expectation, usr.preferred_cities, usr.age_range_from, usr.age_range_to, usr.body_type_pp, usr.complexion_pp, CASE WHEN usr.intercast = 1 THEN "Yes" ELSE "No" END as intercast, CASE WHEN usr.mangal_pp = 1 THEN "Yes" ELSE "No" END as mangal_pp, usr.partner_expectaion_details, usr.isPaidUser, usr.status, CASE WHEN usr.isPaidUser = 1 THEN "Yes" ELSE "No" END as isPaidUser, (SELECT plan_name FROM payments WHERE user_id = usr.id AND status = "Active" ORDER by updated_at DESC limit 1) as plan_name, OL.occupation_name as occupation, RLG.name as religion_id, CL.caste_name as caste_id, MT.name as mother_tounge_id, EL.name as education_field_id
    FROM users usr
    LEFT JOIN occupation_list OL
      ON usr.occupation = OL.id
    LEFT JOIN religions RLG
      ON usr.religion_id = RLG.id
    LEFT JOIN caste_lists CL
      ON usr.caste_id = CL.id
    LEFT JOIN mother_tongue MT
      ON usr.mother_tounge_id = MT.id
    LEFT JOIN education_list EL
      ON usr.education_field_id = EL.id  
    `;
  connectDb.stablishedConnection().then((db) => {
    db.query(sqlObj, function(err, result, fields){
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
/**Sansar Vivah APIs END */