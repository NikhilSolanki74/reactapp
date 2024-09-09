const express = require('express')
const router = express.Router()
const upload = require('../Controller/Uploader');

const { getSellerData, logout, removeAccount,getProductData, edituser,addProduct,multerErrorHandler,myProduct, changeOnMarket , removeProduct,getProductDetail} = require('../Controller/sellerController');

router.post('/getsellerdata',getSellerData);

router.post('/logout',logout);

router.post("/removeAccount", removeAccount);

router.post("/getproductdata", getProductData);

router.post("/edit",edituser);

router.post('/addproduct',upload.array('image',8),multerErrorHandler ,addProduct)

router.post('/myproduct',myProduct);

router.post("/changeonmarket" , changeOnMarket)

router.post("/removeproduct" , removeProduct)

router.post("/getproductdetail" , getProductDetail)

module.exports = router; 