const bcrypt = require('bcryptjs');
const User = require('../models/User');
var config = require('config');
const { Error } = require('mongoose');
const Token = require('../handler/genToken');

module.exports.SignIn = async (loginObj, callback) => {

    this.getUserByEmail(loginObj.phone, (err, res) => {

        if (err) callback(err, null)

        else if (res) {
            if (res.userStatus != 'active' && res.userStatus != 'pending') return callback(new Error("user invalid"), null);

            if (!bcrypt.compareSync(loginObj.password, res.password)) return callback(new Error("invalid Password"), null);

            const token = Token.generateToken(res);

            return callback(null, token)
        }
        else {
            return callback(new Error("invalid email"), null);
        }
    })
}
module.exports.Add = function (newUser, callback) {
    bcrypt.genSalt(config.get('App.SALT_ROUNDS'), (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) return err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}
module.exports.getAllUser = function (callback) {
    User.find(callback);
}
module.exports.forgetPassword = async function (query, callback) {

    const usr = await User.findOne({ 'email': query.email }, (err, res) => {
        if (res) return res
        return err
    })
    if (usr) {
        if (query.password.length > 4) {
            const validPassword = await bcrypt.compare(query.password, usr.password);
            if (!validPassword) {
                usr.password = query.password
                bcrypt.genSalt(config.get('App.SALT_ROUNDS'), (err, salt) => {
                    bcrypt.hash(usr.password, salt, (err, hash) => {
                        if (err) return err;
                        usr.password = hash;
                        usr.save(callback);
                    })
                });
            }
            else callback("Password Not Changed")
        }
        else callback("password length atleast 8")
    }
    else callback("Not Found")
}
module.exports.getUserByToken = async (token, callback) => {
    Token.verifyToken(token).then((res) => {
        if (res) { callback(null, res) }
        else { callback(new Error("Invalid Token"), null) }
    }).catch((err) => {
        callback(err, null)
    })
}
module.exports.findUser = function (email, phone, roles, callback) {

    const queryByEmail = {
        email: email,
        "roles": { $in: roles }
    }
    const queryByPhone = {
        phone: phone,
        "roles": { $in: roles }
    }
    // console.log(queryByUsername)
    // console.log(User.findOne({$or:[queryByContact, queryByEmail, queryByUsername]}))
    User.findOne({ $or: [queryByEmail, queryByPhone] }, callback)
}
module.exports.getUserById = function (id, callback) {
    User.findById({ _id: id }, callback)
}
module.exports.getUserByEmail = function (email, callback) {
    User.findOne({ email: email }, callback)
}
module.exports.getUsersByStatus = function (status, callback) {
    const query = {
        status: status
    }
    User.find(query, callback)
}
module.exports.getUsersCountByRole = function (role, callback) {
    User.find({ roles: [role] }, callback)
}
module.exports.getUsersByUsername = function (name, callback) {
    const query = {
        name: name
    }
    User.find(query, callback)
}
module.exports.getUserByMobile = function (mobile, callback) {
    const query = {
        mobile: mobile
    }
    User.findOne(query, callback)
}
module.exports.comparePassword = function (password, hashPassword, callback) {
    bcrypt.compare(password, hashPassword, (err, isMatch) => {
        console.log("hashpassword :" + hashPassword)
        if (err) throw err;
        callback(null, isMatch);
    });
}
module.exports.forgetPassword = async function (query, callback) {

    const usr = await User.findOne({ 'email': query.email }, (err, res) => {
        if (res) return res
        return err
    })
    if (usr) {
        if (query.password.length > 4) {
            const validPassword = await bcrypt.compare(query.password, usr.password);
            if (!validPassword) {
                usr.password = query.password
                bcrypt.genSalt(config.get('App.SALT_ROUNDS'), (err, salt) => {
                    bcrypt.hash(usr.password, salt, (err, hash) => {
                        if (err) return err;
                        usr.password = hash;
                        usr.save(callback);
                    })
                });
            }
            else callback("Password Not Changed")
        }
        else callback("password length atleast 8")
    }
    else callback("Not Found")
}


module.exports.Update = function (id, updateData, callback) {
    let query = {
        _id: id,
    }
    User.update(query, { $push: updateData }, callback);
}

module.exports.deactivateUser = function (UserId, callback) {
    let query = {
        _id: UserId
    }
    let setStatus = {
        status: 'DeActivate'
    }
    User.update(query, { $set: setStatus }, callback);
}