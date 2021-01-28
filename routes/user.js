const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController')
const permits = require('../handler/oauthorization');

//get the list of all users
router.get('/users', permits('Admin', 'User'), UserController.GetAllUser);

//user registration with or without role defination
router.post('/signup', UserController.AddUser);

//User Login using username, email and mobile number but will be treated as username
router.post('/signin', UserController.SignIn);

//forget password
router.post('/forgetPass', permits('Admin', 'User'), UserController.ForgetPassword);

//update User
router.patch("/updateUser/:id", permits('Admin', 'User'), UserController.Update);

//delete User
router.delete("/deleteUser/:id", permits('Admin', 'User'), UserController.DeActivateUser);

module.exports = router;