const Rent = require('../models/rent');

module.exports.GetAll = function (callback) {
    Rent.find(callback);
}

module.exports.Add = function (formData, callback) {
    formData.save(callback);
}

module.exports.Update = function (id, updateData, callback) {
    let query = {
        _id: id,
    }
    Rent.update(query, { $push: updateData }, callback);
}

module.exports.deactivateProperty = function (UserId, callback) {
    let query = {
        _id: UserId
    }
    let setStatus = {
        status: 'DeActivate'
    }
    Rent.update(query, { $set: setStatus }, callback);
}