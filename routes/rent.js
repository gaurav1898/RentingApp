const express = require('express');
const router = express.Router();
const RentController = require('../controller/RentController')
const permits = require('../handler/oauthorization');

//get the list of all Rent Properties
router.get('/properties', permits('Admin', 'User'), RentController.GetAll);

//Property Addition
router.post('/addNew', permits('Admin', 'User'), RentController.Add);

//update Property
router.put("/updateProperty/:id", permits('Admin', 'User'), RentController.Update);

//delete Property
router.delete("/deleteProperty/:id", permits('Admin', 'User'), RentController.DeActivateProperty);

module.exports = router;