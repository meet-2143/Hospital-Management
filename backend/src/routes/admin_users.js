var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/admin_user');
const jwt = require('jsonwebtoken');
const config = require('./../config');
var CommonModel = require('../models/common');
const authUtil = require('./authUtil.js');
var Util = require('../models/util');
const superagent = require('superagent');
var timestamp = new Date();
timestamp = timestamp.getTime() + timestamp.getTimezoneOffset() * 60000; //to UTC timestamp
var request = require("request");
const moment = require('moment');
const fs = require('fs');
var path = require('path');
const saltRounds = 10;
const myPlaintextPassword = 'admin@admin.com';
const someOtherPlaintextPassword = 'not_bacon';

router.post('/adminLogin', async (req, res, next) => {
    const postData = req.body;
    //username, password
    
    User.getUser({whereCon: [{field: "email", value: postData.username}]}, function(err, usrResult){
        if(err){
            res.status(401).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
        }

        if(usrResult.length == 0){
            var response = {
                "status": "success",
                "message": "User not exist"
            }
            res.status(200).json(response);
        } else {
            bcrypt.compare(postData.password, usrResult[0].password, function(err, result) {
                if(result){
                    var tokenUser = {id: usrResult[0].id, user_type: usrResult[0].user_type, fname: usrResult[0].fname, lname: usrResult[0].lname, phone: usrResult[0].phone, email: usrResult[0].email}

                    const token = jwt.sign(tokenUser, config.secret, {expiresIn: config.tokenLife})

                    var response = {
                        "status": "success",
                        "message": "Login success",
                        "token": token
                    }
                }else{
                    var response = {
                        "status": "success",
                        "message": "Invalid password"
                    }
                }
                res.status(200).json(response);
            });
        }
    });
});

router.get('/getAdminDetails', authUtil.ensureAuthenticated, async (req, res, next) => {
    var id = req.user.id;
    User.getUser({whereCon: [{field: "id", value: id}]}, function(err, usrResult){
        if(err){
            res.status(401).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
        }

        if(usrResult.length == 0){
            var response = {
                "status": "success",
                "message": "User not exist"
            }
            res.status(200).json(response);
        } else {
            var adminUser = [{id: usrResult[0].id, email: usrResult[0].email, updated_at: usrResult[0].updated_at}];
            var response = {
                "status": "success",
                "items": adminUser
            }
            res.status(200).json(response);
        }
    });
});

router.post('/updateAdminProfile', authUtil.ensureAuthenticated, async (req, res, next) => {
    const postData = req.body;
    var obj = {email: postData.email};
    if(postData.password){    
        salt = await bcrypt.genSalt(10);
        obj.password =   await bcrypt.hash(postData.password, salt);
    }

    if(!postData.email || postData.email == ""){
        res.status(401).json({
            "status": "error",
            "message": "New Password is required."
        });
        return
    }

    User.getUser({whereCon: [{field: "id", value: req.user.id}]}, function(err, result){
        if(err){
            res.status(401).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
            return
        }

        if(result.length == 0){
            res.status(401).json({
                "status": "error",
                "message": "User not exist"
            });
        } else {
            CommonModel.customUpdate({ table: 'admin_users', whereCon: [{field: "id", value: req.user.id}] }, obj, function(err, result){
                if(err){
                    res.status(200).json({status: "error", message: "There is some error, please try again later."});
                } else {
                    var response = {
                        "status": "success",
                        "message": "Username/Password updated successfully"
                    }
                    res.status(200).json(response);
                }
            }) 
        }
    });
});

router.post("/*", authUtil.ensureAuthenticated, function (req, res, next) {
    res
        .status(403)
        .json({message: "forbidden"});
});

module.exports = router;