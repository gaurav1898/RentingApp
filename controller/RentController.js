const mongoose = require('mongoose');
const RentSchema = require('../models/rent');
const RentService = require('../services/RentService');

exports.GetAll = (req, res, next) => {
    RentService.GetAll((err, Rent) => {
        if (err) {
            console.log(err)
        }
        return res.json({
            success: true,
            message:"All Rent Properties",
            Rent
        })
    })
}

exports.Add = (req, res, next) => {
    console.log(req.body)
    let formData = new RentSchema({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        rentPrice: req.body.rentPrice,
        manufactureDate: req.body.manufactureDate,
        actualCost: req.body.actualCost,
        rentStatus:"Free",
        status: req.body.status,
        userId: req.tokenData.data._id,
    })
    console.log(formData)

    RentService.Add(formData, (err, rent) => {
        if (err) {
            // console.log(err);
            let message = [];
            if (err.errors.name) message.push("Property Name Required")
            if (err.errors.rentPrice) message.push("rent Price is required.")
            if (err.errors.manufactureDate) message.push("manufacture Date is required.")
            return res.json({
                success: false,
                err_subject: "Error!!",
                err_message: message
            })
        } else {
            return res.json({
                success: true,
                message:"New Property Added Successfully !",
                rent
            })
        }
    })
}

exports.Update = (req, res, next) => {
    console.log("performing update")
    const id = req.params.id;
    if(req.body.rentStatus=="Free"){
    let update = new RentSchema({
        name: req.body.name,
        rentPrice: req.body.rentPrice,
        manufactureDate: req.body.manufactureDate,
        actualCost: req.body.actualCost,
        rentStatus:"Occupied",
        status: req.body.status,
        userId: req.tokenData.data._id,
    })
   
    RentService.Update(id, update, (err, data) => {
        if (err) {
            let message = [];
            console.log(err);
            if (err.errors.name) message.push("Property Name Required")
            if (err.errors.rentPrice) message.push("rent Price is required.")
            if (err.errors.manufactureDate) message.push("manufacture Date is required.")
            return res.json({
                success: false,
                err_subject: "Error !!",
                err_message: message
            })
        } else {
            return res.json({
                success: true,
                success_subject: "Success !!",
                success_message: "Rent Updated Successfully.."
            })
        }
    })
    }
}

exports.DeActivateProperty = (req, res, next) => {
    console.log(req.params._id)
    RentService.deactivateProperty(req.params._id, (err, success) => {
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
                success_message: 'Property Deactivated Successfully'
            })
        }
    })
}