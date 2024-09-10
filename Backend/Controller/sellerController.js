const { registermodel, productTable, orderTable} = require("../dbConnection/db");
const jwt = require('jsonwebtoken');
let cloudinary = require('cloudinary').v2
let fs = require('fs')
const { ObjectId } = require('mongodb');
require('dotenv').config();
const multer = require('multer');


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
  // console.log(req.file)
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

const myProduct =async (req,res)=>{
 try {
      //  const {token} = req.body;
      //  console.log(req.body)
     const chktoken =await checkToken(req.body);
   if(!chktoken._id){
    return res.json({success:false,msg:"User Not Verified !"})
   }
    
   const dt = await productTable.find({sellerId:chktoken._id});
  
   if(!dt){
    return res.json({success:false,msg:"Data Not Found"})
   }

return res.json({success:true,msg:"Data Fetch Successfully",data:dt})

  
 } catch (error) {
  console.log(error);
  res.json({success:false,msg:"server error occured"})
 }
}

const changeOnMarket =async (req,res) => {
     try {
      const chktoken =await checkToken(req.body);
      if(!chktoken._id){
       return res.json({success:false,msg:"User Not Verified !"})
      }
        const {id } = req.body;
         await productTable.findByIdAndUpdate(id ,{ $bit: { onMarket: { xor: 1 } } }).catch((err)=>{
    console.log(err);
    return res.json({success:false,msg:"Failed to change !"})
         })

    return res.json({success:true, msg:'Change Successfully'})  
     } catch (error) {
      console.log(error);
     return  res.json({success:false , msg:"Failed in change !"})
     }
}

const removeProduct = async (req,res) =>{
  try {
    const chktoken =await checkToken(req.body);
    if(!chktoken._id){
     return res.json({success:false,msg:"User Not Verified !"})
    }
      const {id } = req.body;

      await productTable.findByIdAndDelete(id).catch((err)=>{
        console.log(err)
     return  res.json({success:false , msg:"Failed in Delete !"})
      })
      res.json({success:true, msg:"Product Removed Successfully"})
    
  } catch (error) {
    console.log(error);
   return  res.json({success:false , msg:"Failed in Delete !"})
   }
}

const getProductDetail = async (req,res) => {
  try {
    const chktoken =await checkToken(req.body);
    if(!chktoken._id){
     return res.json({success:false,msg:"User Not Verified !"})
    }
      const {id } = req.body;
       if(id === ''){
     return res.json({success:false,msg:"Failed to fetch data !"})
       }
      const data = await productTable.findOne({_id:id}).catch((err)=>{
        console.log(err)
     return  res.json({success:false , msg:"Failed in fetch product !"})
      })

      res.json({success:true, msg:"Product Fetch Successfully",data})
    
  } catch (error) {
    console.log(error);
   return  res.json({success:false , msg:"Failed in fetch product Detail !"})
   }



}


const getOrders = async (req, res) => {
  try {
    const chktoken = await checkToken(req.body);
    if (!chktoken || !chktoken._id) {
      return res.status(400).json({ success: false, msg: "User Not Verified!" });
    }


    const datas = await orderTable.aggregate([
      {
        $match: {
          sellerId: chktoken._id.toString() 
        }
      },
      {
        $addFields: {
          customerIdObj: { $toObjectId: "$customerId" }
        }
      },
      {
        $lookup: {
          from: 'registermodels',
          localField: 'customerIdObj',
          foreignField: '_id',
          as: 'userData'        
        }
      },
      {
        $unwind: {
          path: '$userData',
          preserveNullAndEmptyArrays: true 
        }
      },
      {
        $project: {
          productId:1,
          productImage:1,
          productName: 1,
          count:1,
          price: 1,
          customerId: 1,
          'userData.name': 1,
          'userData.email': 1,
          'userData._id': 1,
          status: 1,
          onCreated: 1
        }
      }
    ]);

    return res.status(200).json({ success: true, orders: datas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Server Error Occurred!" });
  }
};


module.exports = {getSellerData,logout,removeAccount,getProductData,edituser,addProduct,multerErrorHandler,myProduct ,changeOnMarket,removeProduct,getProductDetail, getOrders};
