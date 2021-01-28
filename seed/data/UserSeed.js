const mongoose = require('mongoose');
const UserSchema = require('../../models/User');
const UserService = require('../../services/UserService');
const config = require('config')

exports.Add = (req, res, next) => {
    console.log("Creating User");
    let formData = new UserSchema({
        _id: new mongoose.Types.ObjectId(),
        name: "Gaurav Sharma",
        email: "gaurav@gmail.com",
        password: "gaurav123",
        phone: "8899445566",
        roles: ["Admin"],
        status: "Active",
        salt: config.get('App.SALT_ROUNDS'),
    })
    UserService.Add(formData, (err, user) => {
        if (err) {
            let message = [];
            if (err.errors.email) message.push("Invalid Email Address or Already Taken.")
                if (err.errors.phone) message.push("Mobile number already exists")
                console.log("Error !!");
                console.log(message)
            }
            else {
                console.log("Success !!");
                console.log("Admin User Created Successfully !!")
            }
        })
}
