var express = require('express');
var express = require('express');
var router = express.Router();
const config = require('../config');
var CommonModel = require('../models/common');
var User = require('../models/user');
var StoryModel = require('../models/story');
const authUtil = require('./authUtil.js');
var timestamp = new Date();
timestamp = timestamp.getTime() + timestamp.getTimezoneOffset() * 60000; //to UTC timestamp
const moment = require('moment');
const moment = require('moment');
const AWS = require('aws-sdk');
const S3 = new AWS.S3({region: config.region});

/**Sansar Vivah APIs start */
router.get('/get-religions', async (req, res, next) => {
    CommonModel.getReligions({status: 'Active'},function(err, result){
        if(err){
            res.status(200).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
            return
        }else{
            var response = {
                "status": "success",
                "items": result
            }
            res.status(200).json(response);    
        }
    })
});

router.get('/get-caste', async (req, res, next) => {
    const postData = req.query;
    const condition = {whereCon: [{field: "religion_id", value: postData.religion_id}, {field: "status", value: "Active"}, {field: "type", value: "caste"}]};
    CommonModel.getCasteSubcaste(condition, function(err, result){
        if(err){
            res.status(200).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
            return
        }else{
            var response = {
                "status": "success",
                "items": result
            }
            res.status(200).json(response);    
        }
    })
});

router.get('/get-subcaste', async (req, res, next) => {
    const postData = req.query;
    const condition = {whereCon: [{field: "parent_id", value: postData.caste_id}, {field: "status", value: "Active"}, {field: "type", value: "sub_caste"}]};
    CommonModel.getCasteSubcaste(condition, function(err, result){
        if(err){
            res.status(200).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
            return
        }else{
            var response = {
                "status": "success",
                "items": result
            }
            res.status(200).json(response);    
        }
    })
});

router.get('/get-mother-tongue', async (req, res, next) => {
    const condition = {whereCon: [{field: "status", value: "Active"}]};
    CommonModel.getMotherTongue(condition, function(err, result){
        if(err){
            res.status(200).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
            return
        }else{
            var response = {
                "status": "success",
                "items": result
            }
            res.status(200).json(response);    
        }
    })
});

router.get('/popular-peoples', async (req, res, next) => {
    /**Groom */
    const condition = {whereCon: [{field: "status", value: "Active"}, {field: "gender", value: "Male"}]};
    User.getTop10user(condition, function(err, result){
        if(err){
            res.status(200).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
            return
        }else{
            const groomResult = result;

            /**Bride */     
            const conditionBride = {whereCon: [{field: "status", value: "Active"}, {field: "gender", value: "Female"}]};
            User.getTop10user(conditionBride, function(err, resultBride){
                if(err){
                    res.status(200).json({
                        "status": "error",
                        "message": "There is some problem, please try again later"
                    });
                    return
                }else{
                    const brideResult = resultBride;
                    /**Top 10 Happy story */
                    const conditionHappystory = {whereCon: [{field: "status", value: "Active"}, {field: "published", value: 1}]};
                    StoryModel.getTop10story(conditionHappystory, function(err, resultHappystory){
                        if(err){
                            res.status(200).json({
                                "status": "error",
                                "message": "There is some problem, please try again later"
                            });
                            return
                        }else{
                            const storyResult = resultHappystory;
                            var response = {
                                "status": "success",
                                "items": {top10bride: brideResult, top10groom: groomResult, top10happystory: storyResult}
                            }
                            res.status(200).json(response);    
                        }
                    })
                }
            })
        }
    })
});

router.get('/searchConfig', async (req, res, next) => {
      User.getWelcomeMessage({}, function(err, resultMsg){
        if(err){
            res.status(401).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
            return
        }
        var response = {
            "status": "success",
            "welcomeNote" : "",
            "registrationFormUrl": config.base_url + "public/pdf/registration-form.pdf"
        }
        if(resultMsg.length > 0){
            response.welcomeNote = resultMsg[0].welcome_note || ""
        }  
        res.status(200).json(response);                   
    })   
});

router.get('/getReligionsCastSubcast', async (req, res, next) => {
    /**Get religion */
    CommonModel.getReligions({status: 'Active'},function(err, result){
        if(err){
            res.status(200).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
            return
        }else{
            const religionResult = result;
            /**Get Caste */
            const conditionCaste = {whereCon: [{field: "status", value: "Active"}, {field: "type", value: "caste"}]};
            CommonModel.getCasteSubcaste(conditionCaste, function(err, caste){
                if(err){
                    res.status(200).json({
                        "status": "error",
                        "message": "There is some problem, please try again later"
                    });
                    return
                }else{
                    const casteResult = caste
                    /*Get Sub cast*/
                    const conditionCaste = {whereCon: [{field: "status", value: "Active"}, {field: "type", value: "sub_caste"}]};
                    CommonModel.getCasteSubcaste(conditionCaste, function(err, subCaste){
                        if(err){
                            res.status(200).json({
                                "status": "error",
                                "message": "There is some problem, please try again later"
                            });
                        }else{
                            const subCasteResult = subCaste
                            var response = {
                                "status": "success",
                                "items": { religion: religionResult, caste: casteResult, subCasteResult: subCasteResult }
                            }
                            /*Get Mother tounge*/
                            const conditionLang = {whereCon: [{field: "status", value: "Active"}]};
                            CommonModel.getMotherTongue(conditionLang, function(err, resultLang){
                                if(err){
                                    res.status(200).json({
                                        "status": "error",
                                        "message": "There is some problem, please try again later"
                                    });
                                    return
                                }else{
                                    var response = {
                                        "status": "success",
                                        "items": { religion: religionResult, caste: casteResult, subCasteResult: subCasteResult, motherTounge: resultLang }
                                    }
                                    res.status(200).json(response);    
                                }
                            })  
                        }
                    })                   
                }
            })
        }
    })  
});

/**
 * Upload images on S3 bucket
 */
router.post('/upload-file', authUtil.ensureAuthenticated, async (req, res, next) => {
    const postData = req.body;
    
    if(postData.type == undefined || postData.type == ""){
        res.status(200).json({"status": "error", message: "File Upload type is required."});
    }

    if(!req.files){
		res.status(200).json({"status": "error", message: "No file selected"});
	}else if(req.files.file){
        const reqFile = req.files.file;
        var folderName = ""
        switch (postData.type) {
            case "image-content":
                folderName = "assets/images/contents/"
                break;

            case "image-userDownload":
                folderName = "assets/images/user-downloads/"
                break;
            
            case "video-content":
                folderName = "assets/videos/contents/"
                break;
        
            case "video-userDownload":
                folderName = "assets/videos/user-downloads/"
                break;
                    
            default:
                folderName = "assets/others/"
                break;
        }
		var S3Key = folderName + reqFile.name;
    	var FileURL = config.CloudFront+ folderName + reqFile.name;
		try{
			S3.putObject({
                Body: reqFile.data,
                Key: S3Key,
                ContentType: reqFile.mimetype,
                Bucket: config.S3Bucket,
                ACL:'public-read'
            }, function(err, data) {
                if (err) {
                    console.log(err);
                    res.status(200).json({status: "error", message: "There was an error in uploading file, please try again."});
                } else {
                    res.status(200).json({
                        status: "success", 
                        message: "File has been uploaded successfully.", 
                        fileUrl: FileURL
                    });
                }
            });
	  }catch(err){
	  	res.status(200).json({ "status": "error", message: "No file"});
	  }
	}else{
		res.status(200).json({ "status": "error", message: "No file selected"});
	}  
})

/**Get Education */
router.get('/getEducationList', async (req, res, next) => {
    CommonModel.getEducations({},function(err, result){
        if(err){
            res.status(200).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
            return
        }else{
            var response = {
                "status": "success",
                "items": result
            }
            res.status(200).json(response);    
        }
    })
});

/**Get Occupations */
router.get('/getOccupationList', async (req, res, next) => {
    const reqParams = req.query;
    CommonModel.getOccupations(reqParams,function(err, result){
        if(err){
            res.status(200).json({
                "status": "error",
                "message": "There is some problem, please try again later"
            });
            return
        }else{
            var response = {
                "status": "success",
                "items": result
            }
            res.status(200).json(response);    
        }
    })
});

module.exports = router;