const express = require('express')
const router = express.Router()

const {getAdminData,removeAccount,edituser, getRegisteredUser,getChart} = require('../Controller/adminController');

router.post('/getadmindata', getAdminData);

router.post('/removeaccount', removeAccount)

router.post('/edit', edituser)

router.post('/getregistereduser',getRegisteredUser)

router.post('/getchart',getChart)

module.exports = router;