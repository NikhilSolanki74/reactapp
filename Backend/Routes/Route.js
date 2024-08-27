const express = require('express')
const router = express.Router()

const { Signin,Login, getUserData,resetPassword,getOTP,changePassword, removeAccount, edituser,logout} = require('../Controller/userController')

router.post('/login',Login)
    
router.post('/signin',Signin)

router.post('/getuserdata',getUserData)

router.post('/resetpassword',resetPassword)

router.post('/getotp', getOTP)

router.post('/changepassword', changePassword)

router.post('/removeaccount',removeAccount)

router.post('/edit', edituser)

router.post('/logout',logout)

module.exports = router