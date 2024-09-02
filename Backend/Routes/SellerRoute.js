const express = require('express')
const router = express.Router()
const upload = require('../Controller/Uploader');

const { getSellerData, logout, removeAccount,getProductData, edituser,addProduct,multerErrorHandler} = require('../Controller/sellerController');

router.post('/getsellerdata',getSellerData);

router.post('/logout',logout);

router.post("/removeAccount", removeAccount);

router.post("/getproductdata", getProductData);

router.post("/edit",edituser);

router.post('/addproduct',upload.array('image',5),multerErrorHandler ,addProduct)

module.exports = router;