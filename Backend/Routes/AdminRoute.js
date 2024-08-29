const express = require('express')
const router = express.Router()

const {getAdminData,removeAccount,edituser, getRegisteredUser,getChart, getLine, getEngagmentTime,getLineBar} = require('../Controller/adminController');

router.post('/getadmindata', getAdminData);

router.post('/removeaccount', removeAccount)

router.post('/edit', edituser)

router.post('/getregistereduser',getRegisteredUser)

router.post('/getchart',getChart)

router.post('/getline', getLine)

router.post('/getengagementtime', getEngagmentTime)

router.post('/getlinebar' , getLineBar)

module.exports = router;