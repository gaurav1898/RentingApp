const mongoose = require('mongoose');
const UserSchema = require('../models/User');
const UserService = require('../services/UserService');
const config = require('config')
const Token = require('../handler/genToken');
const roleList = require('../seed/Roles');

exports.AddUser = (req, res, next) => {
    console.log(req.body);
    function generateRandomString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
  
    let password = generateRandomString(7);
        let query = new UserSchema({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            password: password,
            phone: req.body.phone,
            roles: req.body.roles,
            status: req.body.status,
            salt: config.get('App.SALT_ROUNDS'),
            createdBy: req.body.createdBy
        });

        UserService.Add(query, (err, user) => {
            //Validating the Inputs
            if (err) {
                let message = [];
                if (err.errors.email) message.push("Invalid Email Address or Already Taken.")
                if (err.errors.phone) message.push("Mobile number already exists")
                return res.status(400).json({
                    success: false,
                    err_subject: "Error !!",
                    err_message: message,
                })
            }
            else {
                return res.json({
                    success: true,
                    message: "You have been registered Successfully.",
                    user
                })
            }
        })
}

exports.SignIn = (req, res, next) => {
    console.log(req.body)
    console.log("processing login")
    UserService.findUser(req.body.email, req.body.phone, roleList.Roles, (err, user) => {
        if (err) {
            let message = [];
            console.log(err)
            return res.status(400).json({
                success: false,
                err_subject: "Authentication Error",
                err_message: err
            })
        }
        if (!user) {
            console.log(user)

            return res.status(400).json({
                success: false,
                err_subject: "Authentication Error",
                err_message: "Invalid Authentication, Please check your login name and password"
            });
        }
        UserService.comparePassword(req.body.password, user.password, (err, isMatch) => {

            if (err) {
                console.log("eerror while finding user, No user found")
                console.log(err)
            }
            if (isMatch) {
                console.log("user found")
                if (user) {
                    const token = Token.generateToken(user);
                    return res.json({
                        success: true,
                        user: user,
                        role: user.roles,
                        token: "JWT " + token
                    })
                }

            } else {
                return res.status(400).json({
                    success: false,
                    err_subject: "Authentication Error",
                    err_message: "Wrong Password"
                })
            }
        })
    })
}

exports.GetAllUser = (req, res, next) => {
    UserService.getAllUser((err, users) => {

        if (users.length <= 0) {
            res.json({
                success: false,
                message: "There are no user to show, Please add a user"
            })
        } else {
            res.json({
                success: true,
                count: users.length,
                users
            })
        }

    })
}

exports.ForgetPassword = (req, res, next) => {
    if (req.body) {
        let query = new UserSchema({
            email: req.body.email,
            password: req.body.password,
        });
        UserService.forgetPassword(query, (error, user) => {
            //Validating the Inputs
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "Not Found",
                    error
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    message: "User",
                    user
                })
            }
        });
    }
}

exports.Update = (req, res, next) => {
    console.log("performing update")
//All fields are mandatory while updating

    // function generateRandomString(length) {
    //     var result = '';
    //     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     var charactersLength = characters.length;
    //     for (var i = 0; i < length; i++) {
    //         result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //     }
    //     return result;
    // }
  
    // let password = generateRandomString(7);
    const id = req.params.id;
    let update = new UserSchema({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        roles: req.body.roles,
        status: req.body.status,
        salt: config.get('App.SALT_ROUNDS'),
        createdBy: req.tokenData.data._id,
    })
   
    UserService.Update(id, update, (err, data) => {
        if (err) {
            let message = [];
            console.log(err);
            // if (err.errors.email) message.push("Invalid Email Address or Already Taken.")
            // if (err.errors.phone) message.push("Mobile number already exists")
            return res.json({
                success: false,
                err_subject: "Error !!",
                err_message: message
            })
        } else {
            return res.json({
                success: true,
                success_subject: "Success !!",
                success_message: "User Updated Successfully.."
            })
        }
    })
}

exports.DeActivateUser = (req, res, next) => {
    console.log(req.params._id)
    UserService.deactivateUser(req.params._id, (err, success) => {
        if (err) {
            res.json({
                success: false,
                err_subject: 'Error!!',
                err_message: 'Oops Something went wrong, Please contact your admin'
            })
        }
        if (success) {
            res.json({
                success: true,
                success_subject: 'Success!!',
                success_message: 'User Deactivated Successfully'
            })
        }
    })
}


