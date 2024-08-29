const express = require('express')
const router = express.Router()

const { getSellerData, logout, removeAccount,getProductData} = require('../Controller/sellerController')

router.post('/getsellerdata',getSellerData);

router.post('/logout',logout);

router.post("/removeAccount", removeAccount);

router.post("/getproductdata", getProductData);

module.exports = router