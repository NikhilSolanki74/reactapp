const { registermodel, productTable} = require("../dbConnection/db");
const jwt = require('jsonwebtoken');
let cloudinary = require('cloudinary').v2
let fs = require('fs')
require('dotenv').config();
const multer = require('multer')


const checkToken= async (dt)=>{
  try {
    const {token} = dt;
    if(!token){
return false;
    }

   const decode = jwt.verify(token , process.env.JWT_SECRET)
   const id = decode.data;
   const data =await registermodel.findOne({_id:id},'name email contact status')
   if(data && data.status === '2'){
      return data;
   }else{
     return false;
   }
   } catch (error) {
    console.log(error);
    return false;
   }
}

const getSellerData = async (req,res) =>{
    try {
        console.log('aaya')
        const {token} = req.body
        if(!token){
    return res.json({success:false,msg:'you are Currently Logged Out'})
        }
        jwt.verify(token , process.env.JWT_SECRET,async (error,decode)=>{
          if(error){
    return res.json({success:false,msg:'Authentication Error !'})
          }
          const id = decode.data;
          const data = await registermodel.findOne({_id:id},'name email contact status')
          if(data){
             if(data.status === '2'){

                 return res.json({success:true,data:data})
                }
                // console.log('data succccess',data,'end')
            return res.json({success:false,msg:"data not found "})
          }else{
            return res.json({success:false,msg:"data not found "})
          }
        })
    
       } catch (error) {
        console.log(error);
        res.json({
          success:false,
          msg:"server error occured"
        })
       }
}

const logout = (req,res) => {
    return res.json({success:true})
}

const removeAccount = async (req,res) => {
  try {
    const id = req.body.data;
   
    if(!id){
      return res.json({success:false,msg:'Invalid Input data'})
    }
    await registermodel.findByIdAndDelete(id);
      addEvent(id ,'Account Removed by user');
    return res.json({success:true,msg:'Accound Removed Successfully '});
     
  } catch (error) {
    console.log(err)
   return res.json({success:false , msg:'Server Error Occured'})
  }
}


const getProductData = async (req,res)=>{
  try {

    const data = req.body;
    if(!data){
    return res.json({success:false , msg:'User Not Verified'})
    }
  
   const verify = await checkToken(data)
  
  if(!verify){
    return res.json({success:false , msg:'User Not Verified'})
  }

    
    const limit = data.limit || 12;
    const offset = data.offset || 0;


  const productdata = await productTable.find({onMarket:'1'}).limit(limit).skip(offset)
  const count  = await productTable.countDocuments({onMarket:{$eq:'1'}})
  // const pages = Math.ceil(count/limit)
  const more = offset+limit >= count ? false : true;
  // console.log(count, 'hellll')
   if(productdata){
     return res.json({success:true , msg:"data fetched Successfully",productdata ,count,more })

   }else{
    return res.json({success:false , msg:'Data Not Found !'})

   }

  } catch (error) {
    console.log(error)
  return  res.json({success:false, msg:"Error in Fetching Data"})
  }
}

const edituser = async (req,res) => {
  try {
    const {data} = req.body;
    if(!data){
      return res.json({success:false,msg:"Data not Found a3"});
    }
    const tokenData =await checkToken(data)
    if(!tokenData._id){
      return res.json({success:false,msg:"Authorization failure !"})
    }else{
     
    const dataUpdate = await registermodel.findByIdAndUpdate(tokenData._id,{name:data.name , contact:data.contact},{new:true})
    if(dataUpdate){
    
      return res.json({success:true,msg:'User Details Changed Successfully',tokenData})
    }else{
    
      return res.json({success:false,msg:'Error in update details' })
    }
    
    } 
      } catch (error) {
        console.log(error)
        return res.json({success:false , msg:'server Error Occured'})
      }
}

function multerErrorHandler(err, req, res, next) {
  console.log(req.file)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.json({ success: false, msg: 'Image size not exceed more then 5 MB' });
    }
  } else if (err) {
    return res.json({ success: false, msg: err.message });
  }
  next();
}

const addProduct =async (req,res) => {
    try {
       const token =await checkToken(req.body);
//  return console.log(token);
    if(!req.files || !token  || !req.body){
      return res.json({success:false, msg:"Data Not Found!"});
    }
      // console.log(req.files)
      const f = req.files;
      let chk = true;
      let image = "";
        let images = [];
       const date = new Date();
       const st = date.getTime();
      //  return console.log(st);
        cloudinary.config({ 
          cloud_name: process.env.CLOUD_NAME, 
          api_key: process.env.API_KEY, 
          api_secret: process.env.API_SECRET 
        });
       const dd = f.map( async (element,index) => {
          
         await cloudinary.uploader.upload(element.path,{public_id:st+element.filename}).then((result)=>{
          fs.unlinkSync(element.path);
          if(index === 0 ){
            image = result.secure_url;
            
          }else{
            images.push(result.secure_url)
          }
         }).catch((err)=>{
          console.log(err);
         })
        });
       await Promise.all(dd);
        const {product , stock , sellerName , price ,description} = req.body;
        const sellerId = token._id;
        const prd = new productTable({
          product ,stock , sellerName , price , description , image:image, images:images,sellerId
        })
        // console.log(image ,'jj', images);
      await prd.save().then(()=>{
        return res.json({success:true,msg:"Product Created Successfully"})
      }).catch((err)=>{
        console.log(err);
        return res.json({success:false ,msg:"Server Error Occured !"})
      })


      
    } catch (error) {
      console.log(error)
      res.json({success:false,msg:"Server Error occured !"})
    }
}


module.exports = {getSellerData,logout,removeAccount,getProductData,edituser,addProduct,multerErrorHandler };
