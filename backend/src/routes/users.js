var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var CommonModel = require('../models/common');
const jwt = require('jsonwebtoken');
const config = require('./../config');
const authUtil = require('./authUtil.js');
const nodemailer = require('nodemailer');
const mime = require('mime');
var path = require('path');
var async = require("async");
let fs = require('fs-extra');
var timestamp = new Date();
timestamp = timestamp.getTime() + timestamp.getTimezoneOffset() * 60000; //to UTC timestamp
var moment = require('moment');
const multer = require('multer');
const { log } = require('console');
const { json } = require('body-parser');
const { getUserById } = require('../models/admin_user');
let ts = Date.now();
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads")
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
}).single("profile_image");
/**EFF APIs start */

/**
 * Login api
 */
router.post('/login', async (req, res, next) => {
    try {
        const postData = req.body;
        const deviceData = {};
        //const groupCategory = [];
        if (!postData.email) { res.status(201).json({ "status": "error", "message": "Email is required." }); return }
        if (!postData.password) { res.status(201).json({ "status": "error", "message": "Password is required." }); return }
        let getUser = await CommonModel.getRecords({ whereCon: [{ field: "email", value: postData.email }], table: 'users', select: '*' });
        if (getUser.length > 0) {
            let isMatchedPassword = await bcrypt.compare(postData.password, getUser[0].password);
            if (isMatchedPassword) {
                //If not completed verification process after register then we will send OTP to verify it
                // if(getUser[0].is_verify.data[0] == '0'){
                //     res.status(201).json({
                //         "status": "error",
                //         "message": "Your account is Not verified"
                //     });
                //     return
                // }

                //if blocked user by admin then 
                // if(getUser[0].is_active.data[0] == '0'){
                //     res.status(201).json({
                //         "status": "error",
                //         "message": "Your account is Inactive. please contact to admin."
                //     });
                //     return
                // }

                // deviceData.app_platform = postData.app_platform
                // deviceData.app_version = postData.app_version
                // deviceData.device_token = postData.device_token
                // deviceData.os_version = postData.os_version

                // let updateUser = await CommonModel.updateRecords({ table: 'users', whereCon: [{field: "id", value: getUser[0].id}] },deviceData);
                // let preference_detail = await CommonModel.getRecords({whereCon: [{field: "user_id", value: getUser[0].id}], table: 'preference_detail', select: '*'});

                // if(preference_detail.length > 0)
                // {
                //     if(JSON.parse(preference_detail[0].group_category).length)
                //     {
                //         var categoryDetails = await CommonModel.getCategoryRecords(JSON.parse(preference_detail[0].group_category));

                //     }
                //     else
                //     {
                //         var categoryDetails = []
                //     }

                //     if(JSON.parse(preference_detail[0].class_category).length)
                //     {

                //         var classcategoryDetails = await CommonModel.getClassCategoryRecords(JSON.parse(preference_detail[0].class_category));
                //     }
                //     else
                //     {
                //         var classcategoryDetails = []
                //     }
                // }
                // else
                // {
                //     var categoryDetails = []
                //      var classcategoryDetails = []
                // }

                var tokenUser = { id: getUser[0].id, first_name: getUser[0].first_name, last_name: getUser[0].last_name, email: getUser[0].email, mobile_number: getUser[0].mobile_number, role_id: getUser[0].role_id, profile_image: getUser[0].profile_image }

                const token = jwt.sign(tokenUser, config.secret, { expiresIn: config.tokenLife })
                var response = {
                    "status": "success",
                    "message": "Login successfully",
                    "user": tokenUser,
                    "token": token,
                    // 'otp_status': true
                }
                res.status(201).json(response);
            }
            else {
                var response = {
                    "status": "error",
                    "message": "Your email or password is incorrect"
                }
                res.status(201).json(response);
            }
        } else {
            res.status(201).json({ "status": "error", "message": "User does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
        return;
    }
});
router.post('/create_doctor', upload, async (req, res, next) => {
    try {
        console.log(req.file);
        return;
        const postData = req.body;
        const string = 'uploads/' + req.file.originalname;
        const newString = string.replace(/\s+/g, '');
        postData.profile_image = newString;

        console.log(postData);
        const addData = {};
        const docData = {};
        if (!postData.first_name || postData.first_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "First Name is required."
            });
            return
        }
        if (!postData.last_name || postData.last_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "Last Name is required."
            });
            return
        }
        if (!postData.mobile_number || postData.mobile_number == "") {
            res.status(201).json({
                "status": "error",
                "message": "Mobile number is required."
            });
            return
        }
        if (!postData.email || postData.email == "") {
            res.status(201).json({
                "status": "error",
                "message": "Email address is required."
            });
            return
        }
        if (postData.mobile_number.length != 10) {
            res.status(201).json({
                "status": "error",
                "message": "Mobile Number must be 10 digit."
            });
            return
        }
        if (!postData.password || postData.password == "") {
            res.status(201).json({
                "status": "error",
                "message": "Password is required."
            });
            return
        }
        if (postData.password.length > 30 || postData.password.length < 6) {
            res.status(201).json({
                "status": "error",
                "message": "Password length should be between 6 to 30."
            });
            return
        }

        if (!postData.degree || postData.degree == "") {
            res.status(201).json({
                "status": "error",
                "message": "Degree is required."
            });
            return
        }
        if (!postData.education_College || postData.education_College == "") {
            res.status(201).json({
                "status": "error",
                "message": "Education College is required."
            });
            return
        }
        if (!postData.experience || postData.experience == "") {
            res.status(201).json({
                "status": "error",
                "message": "Experience is required."
            });
            return
        }
        if (!postData.speciality || postData.speciality == "") {
            res.status(201).json({
                "status": "error",
                "message": "Speciality is required."
            });
            return
        }
        if (!postData.shift_start || postData.shift_start == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_start is required."
            });
            return
        }
        if (!postData.shift_end || postData.shift_end == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_end is required."
            });
            return
        }
        //check duplicate
        let result = await CommonModel.check_duplicate('email', postData.email, 'users');
        if (result) {
            return res.status(201).json({
                "status": "error",
                "message": "Email is already exists.",
            });
        }
        addData.first_name = postData.first_name
        addData.last_name = postData.last_name
        addData.email = postData.email
        addData.mobile_number = postData.mobile_number
        addData.password = postData.password
        addData.role_id = 2
        addData.profile_image = postData.profile_image
        //Hash password
        salt = await bcrypt.genSalt(10);
        addData.password = await bcrypt.hash(postData.password, salt);
        // addData.user_type = "Borrower"
        // addData.is_active = 1;
        let insertUser = await CommonModel.insertRecords(addData, 'users');
        docData.degree = postData.degree
        docData.education_College = postData.education_College
        docData.experience = postData.experience
        docData.speciality = postData.speciality
        docData.user_id = insertUser
        docData.shift_start = postData.shift_start
        docData.shift_end = postData.shift_end
        let insertDoctor = await CommonModel.insertRecords(docData, ' doctor_details ');

        if (insertUser) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Doctor created successfully "
            });

        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/get_prescription_data_by_appointment_id', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "id is required."
            });
            return
        }
        let getAppointmentId = await CommonModel.getRecords({
            whereCon: [{ field: "patient_id", value: postData.id }], table: 'appointment', select: 'id'
        })
        console.log(getAppointmentId[0].id);
        let getPrescriptionData = await CommonModel.getRecords({
            whereCon: [{ field: "appointment_id", value: getAppointmentId[0].id }], table: 'prescription', select: '*'
        })
        console.log(getPrescriptionData);
        if (getPrescriptionData) {
            return res.status(200).json({
                "status": "sucess",
                "message": "PrescriptionData retrived sucessfully.",
                "items": getPrescriptionData
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/create_chemist', authUtil.ensureAuthenticated, upload, async (req, res, next) => {
    try {
        const postData = req.body;
        const addData = {};
        const chemData = {};
        if (!postData.first_name || postData.first_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "First Name is required."
            });
            return
        }
        if (!postData.last_name || postData.last_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "Last Name is required."
            });
            return
        }
        if (!postData.mobile_number || postData.mobile_number == "") {
            res.status(201).json({
                "status": "error",
                "message": "Mobile number is required."
            });
            return
        }
        if (!postData.email || postData.email == "") {
            res.status(201).json({
                "status": "error",
                "message": "Email address is required."
            });
            return
        }
        if (postData.mobile_number.length != 10) {
            res.status(201).json({
                "status": "error",
                "message": "Mobile Number must be 10 digit."
            });
            return
        }
        if (!postData.password || postData.password == "") {
            res.status(201).json({
                "status": "error",
                "message": "Password is required."
            });
            return
        }
        if (postData.password.length > 30 || postData.password.length < 6) {
            res.status(201).json({
                "status": "error",
                "message": "Password length should be between 6 to 30."
            });
            return
        }
        if (!postData.degree || postData.degree == "") {
            res.status(201).json({
                "status": "error",
                "message": "Degree is required."
            });
            return
        }
        if (!postData.shift_start || postData.shift_start == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_start is required."
            });
            return
        }
        if (!postData.shift_end || postData.shift_end == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_end is required."
            });
            return
        }
        //check duplicate
        let result = await CommonModel.check_duplicate('email', postData.email, 'users');
        if (result) {
            return res.status(201).json({
                "status": "error",
                "message": "Email is already exists.",
            });
        }
        addData.first_name = postData.first_name
        addData.last_name = postData.last_name
        addData.email = postData.email
        addData.mobile_number = postData.mobile_number
        addData.password = postData.password
        addData.role_id = 5

        //Hash password
        salt = await bcrypt.genSalt(10);
        addData.password = await bcrypt.hash(postData.password, salt);
        // addData.user_type = "Borrower"
        // addData.is_active = 1;
        let insertUser = await CommonModel.insertRecords(addData, 'users');
        chemData.degree = postData.degree
        chemData.user_id = insertUser
        chemData.shift_start = postData.shift_start
        chemData.shift_end = postData.shift_end
        let insertChemist = await CommonModel.insertRecords(chemData, 'chemist_details');

        if (insertChemist) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Chemist created successfully "
            });

        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/create_medicine', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const medData = {};
        if (!postData.content || postData.content == "") {
            res.status(201).json({
                "status": "error",
                "message": "content is required."
            });
            return
        }
        if (!postData.medicine || postData.medicine == "") {
            res.status(201).json({
                "status": "error",
                "message": "medicine is required."
            });
            return
        }
        medData.content = postData.content
        medData.medicine = postData.medicine
        let insertMedicine = await CommonModel.insertRecords(medData, 'medicine');
        if (insertMedicine) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Medicine created successfully "
            });
        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later."
            });
        }
    } catch (error) {
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.get('/get_chemist_data', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        let getChemist = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '5' }, { field: "po.status", value: 1 }], table: 'users po', select: 'po.*,poi.shift_start,poi.shift_end',
            join: [
                { joinType: "LEFT JOIN", joinWith: "chemist_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getChemist);
        if (getChemist) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Chemists retrived sucessfully.",
                "items": getChemist
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/delete_chemist', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        // var deletedDoctor = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "status", value: 1 }] });
        var deletedChemist = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "id", value: postData.id }] }, { status: 0 });
        if (deletedChemist) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Chemist deleted sucessfully.",
                "items": deletedChemist
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_chemist_data_by_id', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        let getDoctors = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '5' }, { field: "po.status", value: 1 }, { field: "po.id", value: postData.id }], table: 'users po', select: 'po.*,poi.*',
            join: [
                { joinType: "LEFT JOIN", joinWith: "chemist_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getDoctors);
        if (getDoctors) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Doctors retrived sucessfully.",
                "items": getDoctors[0]
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/get_medicine_data', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        let getMedicine = await CommonModel.getRecords({
            whereCon: [{ field: "status", value: '1' }], table: 'medicine', select: '*',
        });
        console.log(getMedicine);
        if (getMedicine) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Medicine retrived sucessfully.",
                "items": getMedicine
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/delete_medicine', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        // var deletedDoctor = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "status", value: 1 }] });
        var deletedMedicine = await CommonModel.updateRecords({ table: 'medicine', whereCon: [{ field: "id", value: postData.id }] }, { status: 0 });
        if (deletedMedicine) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Medicine deleted sucessfully.",
                "items": deletedMedicine
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_medicine_data_by_id', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        let getMedicine = await CommonModel.getRecords({
            whereCon: [{ field: "status", value: 1 }, { field: "id", value: postData.id }], table: 'medicine', select: '*',
        });
        console.log(getMedicine);
        if (getMedicine) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Doctors retrived sucessfully.",
                "items": getMedicine[0]
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/create_prescription', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const precData = {};
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "id is required."
            });
            return
        }
        if (!postData.medication || postData.medication == "") {
            res.status(201).json({
                "status": "error",
                "message": "medication is required."
            });
            return
        }
        if (!postData.route || postData.route == "") {
            res.status(201).json({
                "status": "error",
                "message": "route is required."
            });
            return
        }
        if (!postData.dosage_type || postData.dosage_type == "") {
            res.status(201).json({
                "status": "error",
                "message": "dosage_type is required."
            });
            return
        }
        if (!postData.dosage || postData.dosage == "") {
            res.status(201).json({
                "status": "error",
                "message": "dosage is required."
            });
            return
        }
        precData.medication = postData.medication
        precData.route = postData.route
        precData.dosage = postData.dosage
        precData.dosage_type = postData.dosage_type
        precData.appointment_id = postData.id
        let insertPrescription = await CommonModel.insertRecords(precData, 'prescription');
        if (insertPrescription) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Prescription created successfully "
            });
        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later."
            });
        }
    } catch (error) {
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/delete_prescription', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        // var deletedDoctor = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "status", value: 1 }] });
        var deletedPrescription = await CommonModel.updateRecords({ table: 'prescription', whereCon: [{ field: "id", value: postData.id }] }, { status: 0 });
        if (deletedPrescription) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Prescription deleted sucessfully.",
                "items": deletedPrescription
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_prescription_data', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        let getPrescription = await CommonModel.getRecords({
            whereCon: [{ field: "appointment_id", value: postData.id }, { field: "status", value: 1 }], table: 'prescription', select: '*',
        });
        console.log(getPrescription);
        if (getPrescription) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Prescription retrived sucessfully.",
                "items": getPrescription
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/updateMedicineProfile', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const medData = {};

        console.log(postData);

        if (!postData.content || postData.content == "") {
            res.status(201).json({
                "status": "error",
                "message": "content is required."
            });
            return
        }
        if (!postData.medicine || postData.medicine == "") {
            res.status(201).json({
                "status": "error",
                "message": "medicine is required."
            });
            return
        }
        medData.content = postData.content
        medData.medicine = postData.medicine

        var UpdatedMedicine = await CommonModel.updateRecords({ table: 'medicine', whereCon: [{ field: "id", value: postData.id }] }, { content: medData.content, medicine: medData.medicine });

        console.log(UpdatedMedicine);
        if (UpdatedMedicine) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Medicine updated successfully "
            });
        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later Error."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/updateDoctorProfile', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const addData = {};
        const docData = {};
        console.log(postData);
        if (!postData.first_name || postData.first_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "First Name is required."
            });
            return
        }
        if (!postData.last_name || postData.last_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "Last Name is required."
            });
            return
        }
        if (!postData.mobile_number || postData.mobile_number == "") {
            res.status(201).json({
                "status": "error",
                "message": "Mobile number is required."
            });
            return
        }
        if (!postData.email || postData.email == "") {
            res.status(201).json({
                "status": "error",
                "message": "Email address is required."
            });
            return
        }
        if (postData.mobile_number.length != 10) {
            res.status(201).json({
                "status": "error",
                "message": "Mobile Number must be 10 digit."
            });
            return
        }
        if (!postData.degree || postData.degree == "") {
            res.status(201).json({
                "status": "error",
                "message": "Degree is required."
            });
            return
        }
        if (!postData.education_College || postData.education_College == "") {
            res.status(201).json({
                "status": "error",
                "message": "Education College is required."
            });
            return
        }
        if (!postData.experience || postData.experience == "") {
            res.status(201).json({
                "status": "error",
                "message": "Experience is required."
            });
            return
        }
        if (!postData.speciality || postData.speciality == "") {
            res.status(201).json({
                "status": "error",
                "message": "Speciality is required."
            });
            return
        }
        if (!postData.shift_start || postData.shift_start == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_start is required."
            });
            return
        }
        if (!postData.shift_end || postData.shift_end == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_end is required."
            });
            return
        }
        addData.first_name = postData.first_name
        addData.last_name = postData.last_name
        addData.email = postData.email
        addData.mobile_number = postData.mobile_number
        addData.role_id = 2
        var UpdatedDoctor = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "id", value: postData.id }] }, { first_name: addData.first_name, last_name: addData.last_name, email: addData.email, mobile_number: addData.mobile_number });
        docData.degree = postData.degree
        docData.education_College = postData.education_College
        docData.experience = postData.experience
        docData.speciality = postData.speciality
        docData.shift_start = postData.shift_start
        docData.shift_end = postData.shift_end
        // let insertDoctor = await CommonModel.insertRecords(docData, ' doctor_details ');
        var UpdatedDoctor2 = await CommonModel.updateRecords({ table: 'doctor_details', whereCon: [{ field: "user_id", value: postData.id }] }, { degree: docData.degree, speciality: docData.speciality, education_College: docData.education_College, experience: docData.experience, shift_start: docData.shift_start, shift_end: docData.shift_end });
        console.log(UpdatedDoctor2);
        if (UpdatedDoctor2) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Doctor updated successfully "
            });
        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later Error."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/updateChemistProfile', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const addData = {};
        const chemData = {};
        console.log(postData);
        if (!postData.first_name || postData.first_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "First Name is required."
            });
            return
        }
        if (!postData.last_name || postData.last_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "Last Name is required."
            });
            return
        }
        if (!postData.mobile_number || postData.mobile_number == "") {
            res.status(201).json({
                "status": "error",
                "message": "Mobile number is required."
            });
            return
        }
        if (!postData.email || postData.email == "") {
            res.status(201).json({
                "status": "error",
                "message": "Email address is required."
            });
            return
        }

        if (!postData.degree || postData.degree == "") {
            res.status(201).json({
                "status": "error",
                "message": "Degree is required."
            });
            return
        }

        if (!postData.shift_start || postData.shift_start == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_start is required."
            });
            return
        }
        if (!postData.shift_end || postData.shift_end == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_end is required."
            });
            return
        }
        addData.first_name = postData.first_name
        addData.last_name = postData.last_name
        addData.email = postData.email
        addData.mobile_number = postData.mobile_number
        addData.role_id = 5
        var UpdatedDoctor = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "id", value: postData.id }] }, { first_name: addData.first_name, last_name: addData.last_name, email: addData.email, mobile_number: addData.mobile_number });
        chemData.degree = postData.degree
        chemData.shift_start = postData.shift_start
        chemData.shift_end = postData.shift_end
        // let insertDoctor = await CommonModel.insertRecords(docData, ' doctor_details ');
        var UpdatedChemist2 = await CommonModel.updateRecords({ table: 'chemist_details', whereCon: [{ field: "user_id", value: postData.id }] }, { degree: chemData.degree, shift_start: chemData.shift_start, shift_end: chemData.shift_end });
        console.log(UpdatedChemist2);
        if (UpdatedChemist2) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Chemist updated successfully "
            });
        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later Error."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/updatePatientProfile', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const addData = {};
        const patData = {};
        console.log(postData);
        if (!postData.first_name || postData.first_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "First Name is required."
            });
            return
        }
        if (!postData.last_name || postData.last_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "Last Name is required."
            });
            return
        }
        if (!postData.mobile_number || postData.mobile_number == "") {
            res.status(201).json({
                "status": "error",
                "message": "Mobile number is required."
            });
            return
        }
        if (!postData.email || postData.email == "") {
            res.status(201).json({
                "status": "error",
                "message": "Email address is required."
            });
            return
        }
        if (postData.mobile_number.length != 10) {
            res.status(201).json({
                "status": "error",
                "message": "Mobile Number must be 10 digit."
            });
            return
        }
        if (!postData.age || postData.age == "") {
            res.status(201).json({
                "status": "error",
                "message": "age address is required."
            });
            return
        }
        if (!postData.gender || postData.gender == "") {
            res.status(201).json({
                "status": "error",
                "message": "gender address is required."
            });
            return
        }
        if (!postData.dieseas || postData.dieseas == "") {
            res.status(201).json({
                "status": "error",
                "message": "dieseas address is required."
            });
            return
        }
        if (!postData.doctor_id || postData.doctor_id == "") {
            res.status(201).json({
                "status": "error",
                "message": "doctor_id address is required."
            });
            return
        }
        addData.first_name = postData.first_name
        addData.last_name = postData.last_name
        addData.email = postData.email
        addData.mobile_number = postData.mobile_number
        addData.role_id = 2
        var Updatedpatient = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "id", value: postData.id }] }, { first_name: addData.first_name, last_name: addData.last_name, email: addData.email, mobile_number: addData.mobile_number });
        patData.age = postData.age
        patData.gender = postData.gender
        patData.dieseas = postData.dieseas
        patData.insurance_id = postData.insurance_id
        patData.insurance_company = postData.insurance_company
        patData.doctor_id = postData.doctor_id

        // let insertDoctor = await CommonModel.insertRecords(docData, ' doctor_details ');
        var UpdatedPatient2 = await CommonModel.updateRecords({ table: 'patient_details', whereCon: [{ field: "user_id", value: postData.id }] }, { age: patData.age, gender: patData.gender, dieseas: patData.dieseas, insurance_id: patData.insurance_id, insurance_company: patData.insurance_company, doctor_id: patData.doctor_id });
        console.log(UpdatedPatient2);
        if (UpdatedPatient2) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Patient updated successfully "
            });
        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later Error."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/updateReceptionistProfile', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const addData = {};
        const recData = {};
        console.log(postData);
        if (!postData.first_name || postData.first_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "First Name is required."
            });
            return
        }
        if (!postData.last_name || postData.last_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "Last Name is required."
            });
            return
        }
        if (!postData.mobile_number || postData.mobile_number == "") {
            res.status(201).json({
                "status": "error",
                "message": "Mobile number is required."
            });
            return
        }
        if (!postData.email || postData.email == "") {
            res.status(201).json({
                "status": "error",
                "message": "Email address is required."
            });
            return
        }
        if (postData.mobile_number.length != 10) {
            res.status(201).json({
                "status": "error",
                "message": "Mobile Number must be 10 digit."
            });
            return
        }
        if (!postData.degree || postData.degree == "") {
            res.status(201).json({
                "status": "error",
                "message": "degree address is required."
            });
            return
        }
        if (!postData.experience || postData.experience == "") {
            res.status(201).json({
                "status": "error",
                "message": "experience address is required."
            });
            return
        }
        if (!postData.shift_start || postData.shift_start == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_start address is required."
            });
            return
        }
        if (!postData.shift_end || postData.shift_end == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_end address is required."
            });
            return
        }
        if (!postData.address || postData.address == "") {
            res.status(201).json({
                "status": "error",
                "message": "address address is required."
            });
            return
        }
        if (!postData.aadhar_card || postData.aadhar_card == "") {
            res.status(201).json({
                "status": "error",
                "message": "aadhar_card is required."
            });
            return
        }
        if (!postData.doctor_id || postData.doctor_id == "") {
            res.status(201).json({
                "status": "error",
                "message": "doctor_id is required."
            });
            return
        }
        addData.first_name = postData.first_name
        addData.last_name = postData.last_name
        addData.email = postData.email
        addData.mobile_number = postData.mobile_number
        addData.role_id = 2
        var Updatedreceptionist = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "id", value: postData.id }] }, { first_name: addData.first_name, last_name: addData.last_name, email: addData.email, mobile_number: addData.mobile_number });
        recData.degree = postData.degree
        recData.experience = postData.experience
        recData.shift_start = postData.shift_start
        recData.shift_end = postData.shift_end
        recData.address = postData.address
        recData.aadhar_card = postData.aadhar_card
        recData.doctor_id = postData.doctor_id

        // let insertDoctor = await CommonModel.insertRecords(docData, ' doctor_details ');
        var UpdatedReceptionist2 = await CommonModel.updateRecords({ table: 'receptionist_details', whereCon: [{ field: "user_id", value: postData.id }] }, { degree: recData.degree, experience: recData.experience, shift_start: recData.shift_start, shift_end: recData.shift_end, address: recData.address, aadhar_card: recData.aadhar_card, doctor_id: recData.doctor_id });
        console.log(UpdatedReceptionist2);
        if (UpdatedReceptionist2) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Receptionist updated successfully "
            });
        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later Error."
            });
        }
    } catch (error) {
        console.log(error);
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/create_patient', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const addData = {};
        const patData = {};

        if (!postData.first_name || postData.first_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "First Name is required."
            });
            return
        }
        if (!postData.last_name || postData.last_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "Last Name is required."
            });
            return
        }
        if (!postData.mobile_number || postData.mobile_number == "") {
            res.status(201).json({
                "status": "error",
                "message": "Mobile number is required."
            });
            return
        }
        if (!postData.email || postData.email == "") {
            res.status(201).json({
                "status": "error",
                "message": "Email address is required."
            });
            return
        }


        if (postData.mobile_number.length != 10) {
            res.status(201).json({
                "status": "error",
                "message": "Mobile Number must be 10 digit."
            });
            return
        }



        if (!postData.password || postData.password == "") {
            res.status(201).json({
                "status": "error",
                "message": "Password is required."
            });
            return
        }

        if (postData.password.length > 30 || postData.password.length < 6) {
            res.status(201).json({
                "status": "error",
                "message": "Password length should be between 6 to 30."
            });
            return
        }

        if (!postData.age || postData.age == "") {
            res.status(201).json({
                "status": "error",
                "message": "age is required."
            });
            return
        }

        if (!postData.gender || postData.gender == "") {
            res.status(201).json({
                "status": "error",
                "message": "gender is required."
            });
            return
        }
        if (!postData.dieseas || postData.dieseas == "") {
            res.status(201).json({
                "status": "error",
                "message": "dieseas is required."
            });
            return
        }
        if (!postData.doctor_id || postData.doctor_id == "") {
            res.status(201).json({
                "status": "error",
                "message": "doctor_id is required."
            });
            return
        }




        //check duplicate
        let result = await CommonModel.check_duplicate('email', postData.email, 'users');
        if (result) {
            return res.status(201).json({
                "status": "error",
                "message": "Email is already exists.",
            });
        }

        addData.first_name = postData.first_name
        addData.last_name = postData.last_name
        addData.email = postData.email
        addData.mobile_number = postData.mobile_number
        addData.password = postData.password
        addData.role_id = 3
        //Hash password
        salt = await bcrypt.genSalt(10);
        addData.password = await bcrypt.hash(postData.password, salt);
        // addData.user_type = "Borrower"
        // addData.is_active = 1;
        let insertUser = await CommonModel.insertRecords(addData, 'users');

        patData.user_id = insertUser
        patData.age = postData.age
        patData.gender = postData.gender
        patData.dieseas = postData.dieseas
        patData.insurance_id = postData.insurance_id
        patData.insurance_company = postData.insurance_company
        patData.doctor_id = postData.doctor_id

        let insertPatient = await CommonModel.insertRecords(patData, 'patient_details');

        if (insertPatient) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Patient created successfully "
            });

        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later."
            });
        }
    } catch (error) {
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/create_patient', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const addData = {};
        const patData = {};

        if (!postData.first_name || postData.first_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "First Name is required."
            });
            return
        }
        if (!postData.last_name || postData.last_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "Last Name is required."
            });
            return
        }
        if (!postData.mobile_number || postData.mobile_number == "") {
            res.status(201).json({
                "status": "error",
                "message": "Mobile number is required."
            });
            return
        }
        if (!postData.email || postData.email == "") {
            res.status(201).json({
                "status": "error",
                "message": "Email address is required."
            });
            return
        }


        if (postData.mobile_number.length != 10) {
            res.status(201).json({
                "status": "error",
                "message": "Mobile Number must be 10 digit."
            });
            return
        }



        if (!postData.password || postData.password == "") {
            res.status(201).json({
                "status": "error",
                "message": "Password is required."
            });
            return
        }

        if (postData.password.length > 30 || postData.password.length < 6) {
            res.status(201).json({
                "status": "error",
                "message": "Password length should be between 6 to 30."
            });
            return
        }

        if (!postData.age || postData.age == "") {
            res.status(201).json({
                "status": "error",
                "message": "age is required."
            });
            return
        }

        if (!postData.gender || postData.gender == "") {
            res.status(201).json({
                "status": "error",
                "message": "gender is required."
            });
            return
        }
        if (!postData.dieseas || postData.dieseas == "") {
            res.status(201).json({
                "status": "error",
                "message": "dieseas is required."
            });
            return
        }
        if (!postData.doctor_id || postData.doctor_id == "") {
            res.status(201).json({
                "status": "error",
                "message": "doctor_id is required."
            });
            return
        }




        //check duplicate
        let result = await CommonModel.check_duplicate('email', postData.email, 'users');
        if (result) {
            return res.status(201).json({
                "status": "error",
                "message": "Email is already exists.",
            });
        }

        addData.first_name = postData.first_name
        addData.last_name = postData.last_name
        addData.email = postData.email
        addData.mobile_number = postData.mobile_number
        addData.password = postData.password
        addData.role_id = 3
        //Hash password
        salt = await bcrypt.genSalt(10);
        addData.password = await bcrypt.hash(postData.password, salt);
        // addData.user_type = "Borrower"
        // addData.is_active = 1;
        let insertUser = await CommonModel.insertRecords(addData, 'users');

        patData.user_id = insertUser
        patData.age = postData.age
        patData.gender = postData.gender
        patData.dieseas = postData.dieseas
        patData.insurance_id = postData.insurance_id
        patData.insurance_company = postData.insurance_company
        patData.doctor_id = postData.doctor_id

        let insertPatient = await CommonModel.insertRecords(patData, 'patient_details');

        if (insertPatient) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "Patient created successfully "
            });

        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later."
            });
        }
    } catch (error) {
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/book_appointment', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const appData = {};
        if (!postData.appointment_Date || postData.appointment_Date == "") {
            res.status(201).json({
                "status": "error",
                "message": "appointment_Date  is required."
            });
            return
        }
        if (!postData.appointment_time || postData.appointment_time == "") {
            res.status(201).json({
                "status": "error",
                "message": "appointment_time is required."
            });
            return
        }
        if (!postData.doctor_id || postData.doctor_id == "") {
            res.status(201).json({
                "status": "error",
                "message": "doctor_id  is required."
            });
            return
        }
        if (!postData.patient_id || postData.patient_id == "") {
            res.status(201).json({
                "status": "error",
                "message": "patient_id  address is required."
            });
            return
        }
        if (!postData.dieseas || postData.dieseas == "") {
            res.status(201).json({
                "status": "error",
                "message": "dieseas is required."
            });
            return
        }
        //check duplicate
        // let result = await CommonModel.check_duplicate('email', postData.email, 'users');
        // if (result) {
        //     return res.status(201).json({
        //         "status": "error",
        //         "message": "Email is already exists.",
        //     });
        // }
        appData.appointment_Date = postData.appointment_Date
        appData.appointment_time = postData.appointment_time
        appData.doctor_id = postData.doctor_id
        appData.patient_id = postData.patient_id
        appData.dieseas = postData.dieseas
        appData.note = postData.note
        appData.role_id = 5
        //Hash password
        // salt = await bcrypt.genSalt(10);
        // addData.password = await bcrypt.hash(postData.password, salt);
        // addData.user_type = "Borrower"
        // addData.is_active = 1;
        let insertAppointment = await CommonModel.insertRecords(appData, 'appointment');
        if (insertAppointment) {
            res.status(201).json({
                "status": "success",
                "message": "Appointment created successfully "
            });
        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later."
            });
        }
    } catch (error) {
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/create_receptionist', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        const recData = {};
        const addData = {};
        if (!postData.first_name || postData.first_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "First Name is required."
            });
            return
        }
        if (!postData.last_name || postData.last_name == "") {
            res.status(201).json({
                "status": "error",
                "message": "Last Name is required."
            });
            return
        }
        if (!postData.mobile_number || postData.mobile_number == "") {
            res.status(201).json({
                "status": "error",
                "message": "Mobile number is required."
            });
            return
        }
        if (!postData.email || postData.email == "") {
            res.status(201).json({
                "status": "error",
                "message": "Email address is required."
            });
            return
        }

        if (!postData.password || postData.password == "") {
            res.status(201).json({
                "status": "error",
                "message": "Password is required."
            });
            return
        }
        if (postData.password.length > 30 || postData.password.length < 6) {
            res.status(201).json({
                "status": "error",
                "message": "Password length should be between 6 to 30."
            });
            return
        }
        if (!postData.degree || postData.degree == "") {
            res.status(201).json({
                "status": "error",
                "message": "degree is required."
            });
            return
        }
        if (!postData.experience || postData.experience == "") {
            res.status(201).json({
                "status": "error",
                "message": "experience is required."
            });
            return
        }
        if (!postData.shift_start || postData.shift_start == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_start is required."
            });
            return
        }
        if (!postData.shift_end || postData.shift_end == "") {
            res.status(201).json({
                "status": "error",
                "message": "shift_end is required."
            });
            return
        }
        if (!postData.address || postData.address == "") {
            res.status(201).json({
                "status": "error",
                "message": "address is required."
            });
            return
        }
        if (!postData.aadhar_card || postData.aadhar_card == "") {
            res.status(201).json({
                "status": "error",
                "message": "aadhar_card is required."
            });
            return
        }

        //check duplicate
        let result = await CommonModel.check_duplicate('email', postData.email, 'users');
        if (result) {
            return res.status(201).json({
                "status": "error",
                "message": "Email is already exists.",
            });
        }
        addData.first_name = postData.first_name
        addData.last_name = postData.last_name
        addData.email = postData.email
        addData.mobile_number = postData.mobile_number
        addData.password = postData.password
        addData.role_id = 4
        //Hash password
        salt = await bcrypt.genSalt(10);
        addData.password = await bcrypt.hash(postData.password, salt);
        // addData.user_type = "Borrower"
        // addData.is_active = 1;
        let insertUser = await CommonModel.insertRecords(addData, 'users');
        recData.user_id = insertUser
        recData.degree = postData.degree
        recData.experience = postData.experience
        recData.shift_start = postData.shift_start
        recData.shift_end = postData.shift_end
        recData.address = postData.address
        recData.aadhar_card = postData.aadhar_card
        recData.doctor_id = postData.doctor_id

        let insertReceptionist = await CommonModel.insertRecords(recData, 'receptionist_details');
        if (insertReceptionist) {
            //if user inserted successfully
            res.status(201).json({
                "status": "success",
                "message": "receptionist created successfully "
            });

        } else {
            res.status(201).json({
                "status": "error",
                "message": "There is some problem, please try again later."
            });
        }
    } catch (error) {
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
router.post('/delete_doctor', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        // var deletedDoctor = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "status", value: 1 }] });
        var deletedDoctor = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "id", value: postData.id }] }, { status: 0 });
        if (deletedDoctor) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Doctors deleted sucessfully.",
                "items": deletedDoctor
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/get_pending_prescription_Patient_data_for_chemist', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        let getPatientId = await CommonModel.getRecords({
            whereCon: [{ field: "Approved", value: 1 }, { field: "prescribed", value: 1 }], table: 'appointment', select: 'patient_id'
        })
        const PatientData = [];
        for (let i = 0; i < getPatientId.length; i++) {
            let getPatientData = await CommonModel.getRecords({
                whereCon: [{ field: "id", value: getPatientId[i].patient_id }], table: 'users', select: '*'
            })
            PatientData[i] = getPatientData;
        }
        console.log(PatientData);
        if (PatientData) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Patient For Prescription retrived sucessfully.",
                "items": PatientData
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_pending_appointment_data', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        let getDoctorId = await CommonModel.getRecords({
            whereCon: [{ field: "user_id", value: postData.id }], table: 'receptionist_details', select: '*'
        })
        let getAppointmentData = await CommonModel.getRecords({
            whereCon: [{ field: "app.status", value: 0 }, { field: "app.doctor_id", value: getDoctorId[0].doctor_id }], table: 'appointment app', select: 'app.*,us.first_name , us.last_name , us_d.first_name as doctor_first_name ,us_d.last_name as doctor_last_name',
            join: [
                { joinType: "LEFT JOIN", joinWith: "users us", joinCondition: "app.patient_id = us.id" },
                { joinType: "LEFT JOIN", joinWith: "users us_d", joinCondition: "app.doctor_id = us_d.id" }
            ]
        });
        console.log(getAppointmentData);
        if (getAppointmentData) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Appointment Details retrived sucessfully.",
                "items": getAppointmentData
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_pending_appointment_data_by_doctor_id', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        let dateObject = new Date();
        let date = ("0" + dateObject.getDate()).slice(-2);
        let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
        let year = dateObject.getFullYear();
        // console.log(year + "-" + month + "-" + date );
        const datee = year + "-" + month + "-" + date;
        console.log(datee);
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        let getAppointmentData = await CommonModel.getRecords({
            whereCon: [{ field: "app.status", value: 1 }, { field: "app.prescribed", value: 0 }, { field: "app.doctor_id", value: postData.id }], table: 'appointment app', select: 'app.*,us.first_name , us.last_name',
            join: [
                { joinType: "LEFT JOIN", joinWith: "users us", joinCondition: "app.patient_id = us.id" },

            ]
        });
        console.log(getAppointmentData);
        if (getAppointmentData) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Appointment Details retrived sucessfully.",
                "items": getAppointmentData
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/Approve_pending_appointment_data', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        var approvedAppointment = await CommonModel.updateRecords({ table: 'appointment', whereCon: [{ field: "id", value: postData.id }] }, { status: 1, Approved: 1 });

        console.log(approvedAppointment);
        if (approvedAppointment) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Appointment Details retrived sucessfully.",
                "items": approvedAppointment
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/Checked_pending_appointment_data', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }

        var checkedAppointment = await CommonModel.updateRecords({ table: 'appointment', whereCon: [{ field: "id", value: postData.id }] }, { prescribed: 1, Approved: 1, status: 1 });

        console.log(checkedAppointment);
        if (checkedAppointment) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Checked Patient sucessfully.",
                "items": checkedAppointment
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/Decline_pending_appointment_data', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        var approvedAppointment = await CommonModel.updateRecords({ table: 'appointment', whereCon: [{ field: "id", value: postData.id }] }, { status: 1, Approved: 0 });

        console.log(approvedAppointment);
        if (approvedAppointment) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Appointment Details retrived sucessfully.",
                "items": approvedAppointment
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/get_receptionist_data', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        let getReceptionist = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '4' }, { field: "po.status", value: 1 }], table: 'users po', select: 'po.*,poi.shift_start,poi.shift_end',
            join: [
                { joinType: "LEFT JOIN", joinWith: "receptionist_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getReceptionist);
        if (getReceptionist) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Receptioinist retrived sucessfully.",
                "items": getReceptionist
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_receptionist_data_by_doctor_id', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        let getReceptionist = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '4' }, { field: "po.status", value: 1 }, { field: "poi.doctor_id", value: postData.id }], table: 'users po', select: 'po.*,poi.shift_start,poi.shift_end',
            join: [
                { joinType: "LEFT JOIN", joinWith: "receptionist_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getReceptionist);
        if (getReceptionist) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Receptioinist retrived sucessfully.",
                "items": getReceptionist
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/get_patient_data', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        let getPatient = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '3' }, { field: "po.status", value: 1 }], table: 'users po', select: 'po.*,poi.age,poi.dieseas',
            join: [
                { joinType: "LEFT JOIN", joinWith: "patient_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getPatient);
        if (getPatient) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Patient retrived sucessfully.",
                "items": getPatient
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_patient_data_by_doctor_id_as_receptionist', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        let getDoctorId = await CommonModel.getRecords({
            whereCon: [{ field: "user_id", value: postData.id }], table: 'receptionist_details', select: 'doctor_id'
        })
        console.log(getDoctorId[0].doctor_id);
        let getPatient = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '3' }, { field: "po.status", value: 1 }, { field: "poi.doctor_id", value: getDoctorId[0].doctor_id }], table: 'users po', select: 'po.*,poi.age,poi.dieseas',
            join: [
                { joinType: "LEFT JOIN", joinWith: "patient_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getPatient);
        if (getPatient) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Patient retrived sucessfully.",
                "items": getPatient
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.get('/get_doctor_data', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        let getDoctor = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '2' }, { field: "po.status", value: 1 }], table: 'users po', select: 'po.*,poi.shift_start,poi.shift_end',
            join: [
                { joinType: "LEFT JOIN", joinWith: "doctor_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getDoctor);
        if (getDoctor) {
            return res.status(200).json({
                "status": "sucess",
                "message": "doctors retrived sucessfully.",
                "items": getDoctor
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_patient_data_by_doctor_id_as_doctor', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }


        let getPatient = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '3' }, { field: "po.status", value: 1 }, { field: "poi.doctor_id", value: postData.id }], table: 'users po', select: 'po.*,poi.age,poi.dieseas',
            join: [
                { joinType: "LEFT JOIN", joinWith: "patient_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getPatient);
        if (getPatient) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Patient retrived sucessfully.",
                "items": getPatient
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/delete_receptionist', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        // var deletedDoctor = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "status", value: 1 }] });
        var deletedDoctor = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "id", value: postData.id }] }, { status: 0 });
        if (deletedDoctor) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Receptionist deleted sucessfully.",
                "items": deletedDoctor
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/delete_patient', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        // var deletedDoctor = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "status", value: 1 }] });
        var deletedPatient = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "id", value: postData.id }] }, { status: 0 });
        if (deletedPatient) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Patient deleted sucessfully.",
                "items": deletedPatient
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_doctor_data_by_id', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        let getDoctors = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '2' }, { field: "po.status", value: 1 }, { field: "po.id", value: postData.id }], table: 'users po', select: 'po.*,poi.*',
            join: [
                { joinType: "LEFT JOIN", joinWith: "doctor_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getDoctors);
        if (getDoctors) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Doctors retrived sucessfully.",
                "items": getDoctors[0]
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_receptionist_data_by_id', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        let getReceptionist = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '4' }, { field: "po.status", value: 1 }, { field: "po.id", value: postData.id }], table: 'users po', select: 'po.*,poi.*',
            join: [
                { joinType: "LEFT JOIN", joinWith: "receptionist_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getReceptionist);
        if (getReceptionist) {
            return res.status(200).json({
                "status": "sucess",
                "message": "Receptionist retrived sucessfully.",
                "items": getReceptionist[0]
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/get_patient_data_by_id', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body
        if (!postData.id || postData.id == "") {
            res.status(201).json({
                "status": "error",
                "message": "ID is required."
            });
            return
        }
        let getpatient = await CommonModel.getRecords({
            whereCon: [{ field: "po.role_id", value: '3' }, { field: "po.status", value: 1 }, { field: "po.id", value: postData.id }], table: 'users po', select: 'po.*,poi.*',
            join: [
                { joinType: "LEFT JOIN", joinWith: "patient_details poi", joinCondition: "po.id = poi.user_id" }
            ]
        });
        console.log(getpatient);
        if (getpatient) {
            return res.status(200).json({
                "status": "sucess",
                "message": "patient retrived sucessfully.",
                "items": getpatient[0]
            });
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/forgotPassword', async (req, res, next) => {
    try {
        const postData = req.body;
        if (!postData.email) { res.status(201).json({ "status": "error", "message": "Email is required." }); return }
        //let getUser = await CommonModel.getRecords({whereCon: [{field: "email", value: postData.email}], table: 'users', select: 'id,name,email'});
        let getUser = await CommonModel.getUserByEmail({ whereCon: [{ field: "email", value: postData.email }, { field: "email_2", value: postData.email }, { field: "email_3", value: postData.email }, { field: "email_4", value: postData.email }, { field: "email_5", value: postData.email }], table: 'users', select: 'id, name,name_2,name_3,name_4,name_5,company_name,phone,email,email_2,email_3,email_4,email_5, password,password_2,password_3,password_4,password_5,mobile,address,profile_image,is_active,user_type' });
        console.log(getUser);
        if (getUser.length) {
            if (getUser[0].email == postData.email) {
                salt = await bcrypt.genSalt(10);
                var password_token = await bcrypt.hash(getUser[0].email, salt)
                var updateToken = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "email", value: getUser[0].email }] }, { reset_token: password_token });
                if (updateToken) {
                    var mailOptions = {
                        from: 'EFF<ino@eff.com>',
                        to: getUser[0].email,
                        subject: "Reset Password Link",
                        html: "Hi " + getUser[0].name + " <br/><br/>Your reset password request has been successfully registered.<br/><br/> Please click on link to reset password. <a href='http://localhost:3001/reset_password?token=" + password_token + "&email=" + getUser[0].email + "' taget='_blank'>Reset Password</a><br/><br/>If you need any further assistance, please reach out to effort@eqfund.org."
                    };
                    CommonModel.sendEmail(mailOptions, function (err, result) {
                        if (err) {
                            res.status(200).json({ status: "error", message: err });
                        } else {
                            res.status(200).json({
                                "status": "success",
                                "message": "Email sent successfully, we will contact you soon"
                            });
                        }
                    })
                    //await CommonModel.updateRecords({ table: 'users', whereCon: [{field: "username", value: getUser[0].username}] }, { forgot_password_request: 1 });
                    res.status(201).json({
                        "status": "success",
                        "message": "Reset password link sent to your email."
                    });
                } else {
                    res.status(201).json({
                        "status": "error",
                        "message": "There is some problem, please try again later."
                    });
                }
            }
            if (getUser[0].email_2 == postData.email) {
                salt = await bcrypt.genSalt(10);
                /*console.log(salt);
                return;*/
                var password_token = await bcrypt.hash(getUser[0].email_2, salt)
                var updateToken = await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "email_2", value: getUser[0].email_2 }] }, { reset_token_2: password_token });
                if (updateToken) {
                    var mailOptions = {
                        from: 'EFF<ino@eff.com>',
                        to: getUser[0].email_2,
                        subject: "Reset Password Link",
                        html: "Hi " + getUser[0].name_2 + " <br/><br/>Your reset password request has been successfully registered.<br/><br/> Please click on link to reset password. <a href='http://localhost:3001/reset_password?token=" + password_token + "&email=" + getUser[0].email_2 + "' taget='_blank'>Reset Password</a><br/><br/>If you need any further assistance, please reach out to effort@eqfund.org."
                    };

                    CommonModel.sendEmail(mailOptions, function (err, result) {
                        if (err) {
                            res.status(200).json({ status: "error", message: err });
                        } else {
                            res.status(200).json({
                                "status": "success",
                                "message": "Email sent successfully, we will contact you soon"
                            });
                        }
                    })
                    //await CommonModel.updateRecords({ table: 'users', whereCon: [{field: "username", value: getUser[0].username}] }, { forgot_password_request: 1 });
                    res.status(201).json({
                        "status": "success",
                        "message": "Reset password link sent to your email."
                    });
                } else {
                    res.status(201).json({
                        "status": "error",
                        "message": "There is some problem, please try again later."
                    });
                }
            }
        } else {
            res.status(201).json({ "status": "error", "message": "This user is not exist." });
        }
    } catch (error) {
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});

/*
 * Reset Password
 */
router.post('/resetPassword', async (req, res, next) => {
    try {
        const postData = req.body;
        if (!postData.email) { res.status(201).json({ "status": "error", "message": "Email is required." }); return }
        if (!postData.password) { res.status(201).json({ "status": "error", "message": "Password is required." }); return }
        if (!postData.password_confirmation) { res.status(201).json({ "status": "error", "message": "Confirm Password is required." }); return }
        if (postData.password != postData.password_confirmation) { res.status(201).json({ "status": "error", "message": "Password and Confirm Password must be same" }); return }

        //let getUser = await CommonModel.getRecords({whereCon: [{field: "email", value: postData.email}], table: 'users', select: 'id, email, reset_token'});
        let getUser = await CommonModel.getUserByEmail({ whereCon: [{ field: "email", value: postData.email }, { field: "email_2", value: postData.email }, { field: "email_3", value: postData.email }, { field: "email_4", value: postData.email }, { field: "email_5", value: postData.email }], table: 'users', select: 'id, email,email_2,email_3,email_4,email_5,reset_token,reset_token_2,reset_token_3,reset_token_4,reset_token_5' });
        /*console.log(getUser);
        return;*/
        if (getUser.length) {
            if (getUser[0].email == postData.email) {
                if (getUser[0].reset_token == postData.token) {

                    salt = await bcrypt.genSalt(10);
                    let newPassword = await bcrypt.hash(postData.password, salt);
                    await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: "email", value: getUser[0].email }] }, { password: newPassword });
                    // await CommonModel.deleteRecords({table: 'otp', whereCon: [{field: "user", value: getUser[0].id}, {field: "otp_type", value: 'forgot_password'}]});
                    res.status(201).json({ "status": "success", "message": "Password updated successfully." });
                    return;
                } else {
                    res.status(201).json({ "status": "error", "message": "Token is mismatch or expire please try again" });
                    return;
                }
            }

        } else {
            res.status(201).json({ "status": "error", "message": "This user is not exist." });
        }
    } catch (error) {
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }

})

router.post('/changePassword', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const postData = req.body;
        if (!postData.email) { res.status(201).json({ "status": "error", "message": "Email is required." }); return }
        if (!postData.old_password) { res.status(201).json({ "status": "error", "message": "Password is required." }); return }
        if (!postData.new_password) { res.status(201).json({ "status": "error", "message": "Password is required." }); return }
        if (!postData.password_confirmation) { res.status(201).json({ "status": "error", "message": "Confirm Password is required." }); return }
        if (postData.new_password != postData.password_confirmation) { res.status(201).json({ "status": "error", "message": "Password and Confirm Password must be same" }); return }

        //let getUser = await CommonModel.getRecords({whereCon: [{field: "email", value: postData.email}], table: 'users', select: 'id, email,password'});
        let getUser = await CommonModel.getUserByEmail({ whereCon: [{ field: "email", value: postData.email }, { field: "email_2", value: postData.email }, { field: "email_3", value: postData.email }, { field: "email_4", value: postData.email }, { field: "email_5", value: postData.email }], table: 'users', select: 'id, name,company_name,phone,email,email_2,email_3,email_4,email_5, password,password_2,password_3,password_4,password_5,mobile,address,profile_image,is_active' });
        //console.log(getUser);

        if (getUser.length) {

            var isMatchedPassword = await bcrypt.compare(postData.old_password, getUser[0].password);
            var db_field = 'email'
            var db_values = getUser[0].email;
            var db_password = 'password'


            if (isMatchedPassword) {
                salt = await bcrypt.genSalt(10);
                let newPassword_hash = await bcrypt.hash(postData.new_password, salt);
                /*console.log(newPassword_hash);
                return;*/

                await CommonModel.updateRecords({ table: 'users', whereCon: [{ field: db_field, value: db_values }] }, { password: newPassword_hash });

                res.status(201).json({ "status": "success", "message": "Password updated successfully." });
            } else {
                res.status(201).json({ "status": "error", "message": "Old Password is not match" });
            }
        } else {
            res.status(201).json({ "status": "error", "message": "This user is not exist." });
        }
    } catch (error) {
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
})
/**
* Get User Profile
*/
router.get('/getUserProfile', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        /*console.log(req.user);
        return;*/
        const userId = req.user.id
        const getParams = req.query;
        //const pro = req.user.profile_image

        let result = await CommonModel.getRecords({ whereCon: [{ field: "id", value: userId }], table: 'users', select: '*' });

        let getUserDetails = await CommonModel.getRecords({ whereCon: [{ field: "email", value: getParams.email }], table: 'users', select: 'id, first_name, last_name,email,mobile_number,role_id' });
        res.status(201).json({ "status": "success", "first_name": getUserDetails[0].first_name, "last_name": getUserDetails[0].last_name, "email": getUserDetails[0].email, "mobile_number": getUserDetails[0].mobile_number });
    } catch (error) {
        console.log(error)
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});

// router.post('/updateDoctorProfile', authUtil.ensureAuthenticated,  async (req, res, next) => {
//     const userId = req.user.id
//     const postData = req.body
//     console.log(postData);
//     if (!userId || userId == "") {
//         res.status(201).json({
//             "status": "error",
//             "message": "userId is required."
//         });
//         return
//     }
//     if (!postData.first_name || postData.first_name == "") {
//         res.status(201).json({
//             "status": "error",
//             "message": "first Name is required."
//         });
//         return
//     }
//     if (!postData.last_name || postData.last_name == "") {
//         res.status(201).json({
//             "status": "error",
//             "message": "last Name is required."
//         });
//         return
//     }
//     if (!postData.mobile_number || postData.mobile_number == "") {
//         res.status(201).json({
//             "status": "error",
//             "message": "Phone number is required."
//         });
//         return
//     }
//     if (!postData.email || postData.email == "") {
//         res.status(201).json({
//             "status": "error",
//             "message": "Email is required."
//         });
//         return
//     }
//     if (!postData.speciality || postData.speciality == "") {
//         res.status(201).json({
//             "status": "error",
//             "message": "speciality is required."
//         });
//         return
//     }
//     if (!postData.education_College || postData.education_College == "") {
//         res.status(201).json({
//             "status": "error",
//             "message": "education_College is required."
//         });
//         return
//     }
//     if (!postData.experience || postData.experience == "") {
//         res.status(201).json({
//             "status": "error",
//             "message": "experience is required."
//         });
//         return
//     }
//     if (!postData.shift_start || postData.shift_start == "") {
//         res.status(201).json({
//             "status": "error",
//             "message": "shift_start is required."
//         });
//         return
//     }
//     if (!postData.shift_end || postData.shift_end == "") {
//         res.status(201).json({
//             "status": "error",
//             "message": "shift_end is required."
//         });
//         return
//     }
//     // if (postData.password) {
//     //     salt = await bcrypt.genSalt(10);
//     //     obj.password = await bcrypt.hash(postData.password, salt);
//     // }
//     let result = await CommonModel.getRecords({ whereCon: [{ field: "id", value: userId }], table: 'users', select: '*' });
//     CommonModel.getUser({ whereCon: [{ field: "id", value: req.user.id }] }, function (err, result) {
//         if (err) {
//             res.status(401).json({
//                 "status": "error",
//                 "message": "There is some problem, please try again later"
//             });
//             return
//         }
//         if (result.length == 0) {
//             res.status(401).json({
//                 "status": "error",
//                 "message": "User not exist"
//             });
//         } else {
//             //let getUserDetails = CommonModel.getRecords({whereCon: [{field: "email", value: postData.email}], table: 'users', select: '*'});
//             // if (postData.profile_image == undefined || postData.profile_image == '') {
//             //     var obj = { first_name: postData.first_name, last_name: postData.last_name, email: postData.email, mobile_number: postData.mobile_number, shift_end: postData.shift_end, shift_start: postData.shift_start, speciality: postData.speciality, degree: postData.degree, speciality: postData.speciality, education_College: postData.education_College, experience: postData.experience };
//             // }
//             // else {
//             //     const body2 = { profilepic: postData.profile_image };
//             //     const t = body2.profilepic.match(/[^:/]\w+(?=;|,)/)[0];
//             //     const path = '/public/images/profileImg/' + Date.now() + '.' + t
//             //     const imgdata = postData.profile_image;
//             //     // to convert base64 format into random filename
//             //     const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
//             //     fs.writeFileSync('./public/images/profileImg/' + Date.now() + '.' + t, base64Data, { encoding: 'base64' });
//             //     var obj = { name: postData.name, company_name: postData.company_name, phone: postData.phone, email: postData.email, mobile: postData.mobile, address: postData.address, profile_image: path };
//             // }
//             CommonModel.customUpdate({ table: 'users', whereCon: [{ field: "id", value: req.user.id }] }, obj, function (err, result) {
//                 if (err) {
//                     res.status(200).json({ status: "error", message: "There is some error, please try again later." });
//                 } else {
//                     const logData = {}
//                     logData.user_id = req.user.id
//                     logData.log_type = "profile"
//                     logData.log_message = "Profile updated successfully"
//                     //let insertLog = CommonModel.insertRecords( logData, 'log');
//                     var response = {
//                         "status": "success",
//                         "message": "Profile updated successfully"
//                     }
//                     res.status(200).json(response);
//                 }
//             })

//         }
//     });
// });
router.get('/get_userlist', authUtil.ensureAuthenticated, async (req, res, next) => {
    try {
        const userId = req.user.id
        const getParams = req.query;

        let result = await CommonModel.getRecords({ table: 'users', select: 'id,name,company_name,email,phone,mobile,address,profile_image' });

        res.status(201).json({ "status": "success", "items": result });
    } catch (error) {
        console.log(error)
        res.status(201).json({ "status": "error", "message": "There is some problem, please try again later." })
    }
});
/**END - EFF APIs*/
router.post("/*", authUtil.ensureAuthenticated, function (req, res, next) {
    res
        .status(403)
        .json({ message: "forbidden" });
});


module.exports = router;