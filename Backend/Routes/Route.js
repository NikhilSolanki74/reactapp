const express = require('express')
const router = express.Router()

const { Signin,Login, getUserData,resetPassword,getOTP,changePassword, removeAccount, edituser,logout, getProductData ,getProductDetail,addToCart,myCart , removeCartItem ,decreaseCartItem,createOrder,clearCart, paymentSuccess , getOrders , cancelOrder , deleteOrder} = require('../Controller/userController')

router.post('/login',Login)
    
router.post('/signin',Signin)

router.post('/getuserdata',getUserData)

router.post('/resetpassword',resetPassword)

router.post('/getotp', getOTP)

router.post('/changepassword', changePassword)

router.post('/removeaccount',removeAccount)

router.post('/edit', edituser)

router.post('/logout',logout)

router.post("/getproductdata" ,getProductData)

router.post("/getproductdetail" ,getProductDetail)

router.post("/addtocart",addToCart)

router.post("/mycart", myCart)

router.post('/removecartitem',removeCartItem)

router.post('/decreaseitemcount',decreaseCartItem)

router.post('/create-order',createOrder)

router.post('/clearcart', clearCart)

router.post('/paymentsuccess', paymentSuccess)

router.post('/getorders', getOrders)

router.post('/cancelorder',cancelOrder)

router.post("/deleteorder", deleteOrder)

module.exports = router