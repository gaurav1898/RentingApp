const mongoose = require('mongoose');
const statusList = require('../seed/Status');
const uniqueValidator = require('mongoose-unique-validator');

//Rent Schema
const SCHEMA = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: false
    },
    rentPrice: {
        type: Number,
        required: false
    },
    manufactureDate: {
        type: Date,
        require: false
    },
    actualCost: {
        type: String,
        unique: false
    },
    rentStatus:{
        type: String,
        enum: statusList.Rent_status,
        default: 'Free'
    },
    status: {
        type: String,
        enum: statusList.User_status,
        default: 'Active'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

SCHEMA.plugin(uniqueValidator);
const rent = module.exports = mongoose.model('rent', SCHEMA);