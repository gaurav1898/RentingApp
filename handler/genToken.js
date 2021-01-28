'use strict';
const jwt = require('jsonwebtoken');
var config = require('config');

module.exports.generateToken = function (user) {
    console.log(user)
    const token = jwt.sign({
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            roles: user.roles,
            status: user.status,
        }
    }, config.get('App.SECRET_CODE'),
        {
            expiresIn: config.get('App.TokenExpiresIn')
        });
    // console.log(token);
    return token;
}


module.exports.verifyToken = async function (token) {
    if (!token) {
        const error = new TypeError('Token Should Not Be Empty');
        throw error;
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, config.get('App.SECRET_CODE'), (error, decodedToken) => {
            if (error) {
                error.status = 401;
                reject(error);
            } else {

                resolve(decodedToken);
            }
        });
    })

}