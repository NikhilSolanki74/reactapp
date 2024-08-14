const express = require('express')
const router = express.Router()

const { Signin,Login, getUserData,resetPassword,getOTP,checkOTP,changePassword} = require('../Controller/userController')

router.post('/login',Login)
    
router.post('/signin',Signin)

router.post('/getuserdata',getUserData)

router.post('/resetpassword',resetPassword)

router.post('/getotp', getOTP)

router.post('/checkotp',checkOTP)

router.post('/changepassword', changePassword)

module.exports = router