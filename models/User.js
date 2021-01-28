const mongoose = require('mongoose');
const roleList = require('../seed/Roles');
const statusList = require('../seed/Status');
const uniqueValidator = require('mongoose-unique-validator');

//User Schema
const SCHEMA = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: false
    },
    email: {
        type: String,
        unique: true,
        index: true,
        match: [/\S+@\S+\.\S+/, "Invalid"]
    },
    password: {
        type: String,
        require: false
    },
    phone: {
        type: String,
        unique: false
    },
    salt: {
        type: String
    },
    roles: {
        type: [{
            type: String,
            enum: roleList.Roles
        }],
        default: ['User']
    },
    status: {
        type: String,
        enum: statusList.User_status,
        default: 'Active'
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:false
    }
}, { timestamps: true });

SCHEMA.plugin(uniqueValidator);
const User = module.exports = mongoose.model('User', SCHEMA);