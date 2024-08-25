const { registermodel } = require("../dbConnection/db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();


const checkToken= async (dt)=>{
  try {
    const {token} = dt;
    if(!token){
return false;
    }

   const decode = jwt.verify(token , process.env.JWT_SECRET)
   const id = decode.data;
   const data =await registermodel.findOne({_id:id},'name email contact')
   if(data){
      return data;
   }else{
     return false;
   }
   } catch (error) {
    console.log(error);
    return false;
   }
}

const getAdminData = (req,res) =>{
    try {
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
            console.log('data succccess',data,'end')
             return res.json({success:true,data:data})
          }else{
            return res.json({success:false,msg:"data not found a2"})
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

const removeAccount = async (req,res)=>{
  try {
    const id = req.body.data;
   
    if(!id){
      return res.json({success:false,msg:'Invalid Input data'})
    }
    await registermodel.findByIdAndDelete(id )
      
    return res.json({success:true,msg:'Accound Removed Successfully '}) 
     
  } catch (error) {
    console.log(err)
   return res.json({success:false , msg:'Server Error Occured'})
  }
}

const edituser = async (req,res)=>{
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



const getRegisteredUser =async (req ,res) =>{
  try {

    const data = req.body;
    if(!data){
    return res.json({success:false , msg:'User Not Verified'})
    }
  //  console.log(data);
   const verify = await checkToken(data)
   console.log(verify)
  if(!verify){
    return res.json({success:false , msg:'User Not Verified'})
  }

    
    const limit = data.limit || 13;
    const skip = data.skip || 0;


  const userdata = await registermodel.find({status:'0'},'name email contact').limit(limit).skip(skip)
  const count  = await registermodel.countDocuments({status:{$eq:'0'}})
  const pages = Math.ceil(count/limit)
  // console.log(count, 'hellll')
   if(userdata){
     return res.json({success:true , msg:"data fetched Successfully",userdata ,pages })

   }else{
    return res.json({success:false , msg:'Data Not Found !'})

   }

  } catch (error) {
    console.log(error)
  return  res.json({success:false, msg:"Error in Fetching Data"})
  }
}


module.exports = {getAdminData,removeAccount,edituser,getRegisteredUser}