const User = require('../models/admin_user');
const jwt = require('jsonwebtoken');
const config = require('./../config');
const superagent = require('superagent');
var timestamp = new Date();
timestamp = timestamp.getTime() + timestamp.getTimezoneOffset() * 60000; //to UTC timestamp

module.exports.ensureAuthenticated = function(req, res, next){
	const token = req.headers['authorization'];
  //console.log("token checking....", JSON.stringify(token))
	if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        if(err.name == "TokenExpiredError"){
          return res.status(401).json({"status": "error", "message": 'Unauthorized access.', tokenExpired: true });
        } else {
          console.log(err)
          return res.status(401).json({"status": "error", "message": 'Unauthorized access.' });
        }
      }
      req.decoded = decoded;
      
      User.getUserById({id: decoded.id}, function(err, user){
      	if(err){
        	return res.status(401).json({"status": "error", "message": 'Unauthorized access.' });
      	}else{
          var currentUser = []
          if(user.length > 0){
            currentUser = {id: user[0].id, first_name: user[0].first_name, middle_name: user[0].middle_name, last_name: user[0].last_name, email: user[0].email, profile_image: user[0].profile_image, gender: user[0].gender };
          }
          req.user = currentUser;
      		next();
      	}
      });
    });
  }else{
    console.log("Failing here no token");
    res.status(401).send({"status": "error", "message": 'Unauthorized access.' });
  }
}


module.exports.optionallyAuthenticated = function(req, res, next){
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        next();
      }else{
        req.decoded = decoded;
        if(req.decoded){
          User.getUserById({id: decoded.id}, function(err, user){
            if(err){
              next();
            }else{
              var currentUser = {id: user[0].id, first_name: user[0].first_name, middle_name: user[0].middle_name, last_name: user[0].last_name, email: user[0].email, profile_image: user[0].profile_image, gender: user[0].gender };
              req.user = currentUser;
              next();
            }
          });
        }else{
          next();
        }
      }
    });
  }else{
    next();
  }
}
