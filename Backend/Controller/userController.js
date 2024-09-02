const { registermodel, useractivity } = require("../dbConnection/db");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
require('dotenv').config();


const addEvent = async (id , action)=> {
  const now  = Math.round(Date.now() / 1000);
// console.log(now);
  const newDoc =  new useractivity({
    createdAt:now,
    userId:id,
    action:action
    })
    const savedData= await newDoc.save().catch((err)=>{
console.log(err)
return false;
    });
    if(savedData){
      return true;
    }else{
      return false;
    }
}


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


const Signin = async (req, res) => {
  try {
    if (req.body) {
      const { name, email, password, contact,country,role } = req.body;
      const checkEmail = await registermodel.findOne({ email: email });

      if (checkEmail) {
        return res.json({
          success: false,
          msg: "This Email is already Exists",
        });
      }
      let status = '0'
  if(role === 'User'){
     status = '0';
  }else if(role === 'Seller'){
     status = '2';
  }
     const salt = await bcrypt.genSalt(10)
     const hashpassword = await bcrypt.hash(password, salt).catch((err)=>{console.log(err);return res.json({ success: false, msg: "server error occured" })});
          
          const userdata = new registermodel({
            name,
            email,
            password:hashpassword,
            contact,
            country,
            status,
          });
          
         const userdetail = await userdata.save().catch((err) => {
           console.log(err);
              return res.json({
                success: false,
                msg: "something wrong happen ,data not saved",
              });
            });
           addEvent(userdetail._id , 'New Register');
            // console.log(ddd)
           const token = jwt.sign({data:userdetail._id} ,process.env.JWT_SECRET,{expiresIn:'1d'} );
           return res.json({
            success:true,
            msg:"User Registered Successfully",
            token:token
           })
 


    } else {
      return res.json({
        success: false,
        msg: "data not saved, something wrong happen",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "server error occured" });
  }
};





const Login = async (req, res) => {
  try {
    if(!req.body && !req.body.email && !req.body.password && !req.body.country){
        return res.json({
            success: false,
            msg: "data not Valid ,Something wrong happen",
          });
    }
    const { email, password,country } = req.body;

    const checkemail = await registermodel.findOne({email:email})
    if(!checkemail){
        return res.json({
            success: false,
            msg: "Email Not Exists, Please check again",
          });
    }
    const hashpass = await registermodel.findOne({_id:checkemail._id},'password _id status country')
    
   bcrypt.compare(password,hashpass.password ,async (err,result)=>{
    if (err) {
        return res.json({ success: false, msg: "server error occured" });
      }else{

        if(result){
          if(hashpass.status == '0'){
          await addEvent(hashpass._id, 'User Login')
        }
          const token = jwt.sign({data:hashpass._id} ,process.env.JWT_SECRET,{expiresIn:'1d'} );
        //  return console.log(hashpass.status);
          return res.json({success:true,msg:'Login Successfully',token:token,status:hashpass.status })
        }else{
          console.log(result)
          return res.json({success:false,msg:'Incorrect Password'})
        }
      }
   })

  } catch (error) {
    console.log(error);
    return res.json({ success: false, msg: "server error occured" });
  }
};


const getUserData = async (req,res)=>{
   try {
    const {token} = req.body
    if(!token){
return res.json({success:false,msg:'data not found'})
    }
    jwt.verify(token , process.env.JWT_SECRET,async (error,decode)=>{
      if(error){
return res.json({success:false,msg:'Authentication Error !'})
      }
      const id = decode.data;
      const data = await registermodel.findOne({_id:id},'name email contact status')
      if(data){
        await addEvent(id,'Page Refreshed');
         return res.json({success:true,data:data})
      }else{
        return res.json({success:false,msg:"data not found"})
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


const resetPassword = async (req,res)=>{
try {
  const {currentpassword , newpassword,email} = req.body;
    if(!currentpassword || !newpassword || !email){
      return res.json({success:false , msg:'invalid inputs'})
    }
     
    const userdata =await registermodel.findOne({email:email},'password _id')
  
    if(!userdata){
      return res.json({success:false , msg:'Email not Exist !'})
    }
    const checkpass = await bcrypt.compare(currentpassword , userdata.password)
    if(!checkpass){
      return res.json ({success:false,msg:"your Current Password is Wrong"})
    }
   const salt = await bcrypt.genSalt(10)
   const newhashpass = await bcrypt.hash(newpassword , salt).catch((err)=>{console.log(err); return res.json({success:false,msg:'server error occured'})})

    await registermodel.findByIdAndUpdate(userdata._id ,{password:newhashpass}).then(()=>{
      addEvent(userdata._id ,"User Password Changed without OTP")
      return res.json({
        success:true,
        msg:'Password changed Successfully'
      })
    }).catch((err)=>{
console.log(err);
res.json({success:false,
  msg:'server error occured'
})
    })


} catch (error) {
  console.log(error)
  return res.json({success:false,msg:'server error occured'})
}
}


const getOTP = async (req,res)=>{
  if(!req.body){
    return res.json({success:false,msg:'Not a valid input'})
  }
  let baseurl = "http://localhost:3000/changepassword/?";
  const {email} = req.body;
  const userdata = await registermodel.findOne({email:email},'_id name')
if(!userdata){
  return res.json({success:false,msg:'Email is not registered'})
}
  // const otp = Math.floor(1000000*Math.random())
 const token = await jwt.sign({data:userdata._id},process.env.JWT_SECRET,{expiresIn:'30m'})
 
 await registermodel.findByIdAndUpdate(userdata._id , {token:token}).catch((err)=>{
    console.log(err);
    return res.json({success:false,msg:'server token error'})
 });

  baseurl = baseurl + `email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`


  // await registermodel.findByIdAndUpdate(userdata._id ,{otp:otp})
  const transporter = nodemailer.createTransport({
    service:'gmail',
   auth: {
       user: process.env.GOOGLE_EMAIL_ID,
       pass: process.env.GOOGLE_APP_PASSWORD
   }
});
let msg = {
 from: process.env.GOOGLE_EMAIL_ID,
 to: email,
 subject: 'For password change ',
 html: `
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Forgot Password Email</title>
   <style>
       body {
           font-family: Arial, sans-serif;
           margin: 0;
           padding: 0;
           background-color: #f4f4f4;
       }
       .container {
           width: 100%;
           max-width: 600px;
           margin: 0 auto;
           background-color: #ffffff;
           padding: 20px;
           box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
       }
       .header {
           background-color: #007bff;
           color: #ffffff;
           text-align: center;
           padding: 10px 0;
       }
       .header h1 {
           margin: 0;
       }
       .content {
           padding: 20px;
       }
       .content h2 {
           color: #333333;
       }
       .token {
           font-size: 15px;
           color: #007bff;
           text-align: center;
           margin: 20px 0;
       }
       .footer {
           background-color: #f4f4f4;
           text-align: center;
           padding: 10px 0;
           font-size: 12px;
           color: #666666;
       }
       @media (max-width: 600px) {
           .container {
               padding: 10px;
           }
           .content {
               padding: 10px;
           }
       }
   </style>
</head>
<body>
   <div class="container">
       <div class="header">
           <h1>Julissa Limited</h1>
       </div>
       <div class="content">
           <h2>Reset Your Password</h2>
           <p>Dear ${userdata.name},</p>
           <p>We received a request to reset your password. Use the following url to reset your password:</p>
           <div class="token"><a href="${baseurl}">${baseurl}</a></div>
           <p>This URL String is valid for the next 30 minutes..</p>
           <p>Thank you,</p>
           <p>Team Julissa.</p>
       </div>
       <div class="footer">
           <p>&copy; 2024 Julissa Pvt. Ltd. All rights reserved.</p>
       </div>
   </div>
</body>
</html>
`
};

  
    transporter.sendMail(msg ,(err,info)=>{
       if(err){
         console.log(err)
         return res.json({success:false,msg:'Error occured on mail send'})
       }else{
         addEvent(userdata._id,'OTP send for Password change')
         return res.json({success:true,msg:'Check your Email, Reset URL Sent Successfully'})
       }
   } )

}

// const checkOTP = async (req,res)=>{
//    const {newpassword , email ,otp } = req.body;
   
//    const userdata = await registermodel.findOne({email:email},'otp _id')
     
//    if(!userdata){
//     return res.json({success:false,msg:'server error occured'})
//    }
//    const dbotp = userdata.otp.toString();
//   //  console.log(otp,'hello',dbotp)
//    if(otp !== dbotp ){
//     return res.json({success:false, msg:"OTP not match !"})
//    }
//       const salt =await  bcrypt.genSalt(10);
//       // console.log(typeof(newpassword))
//       const hash =await bcrypt.hash(newpassword ,salt)
//    await registermodel.findByIdAndUpdate(userdata._id , {password:hash}).then(()=>{
//     addEvent(userdata._id  ,'Password changed with OTP')
//     return res.json({success:true,msg:'Password Changed Successfully'
//     })
//    }).catch((err)=>{
//     console.log(err)
//     return res.json({success:false,msg:'Error in save password'})
//    })


// }

const changePassword = async (req,res) =>{
  try {
    const {email , token , newpassword } = req.body;
    if(!email || !token || !newpassword){
     return res.json({success:false,msg:'Not a valid input data'})
    }
  const decode = jwt.verify(token , process.env.JWT_SECRET)

      const id =  decode.data;
      const salt =await bcrypt.genSalt(10);
      const hash =await  bcrypt.hash(newpassword , salt)
if(!hash){
return res.json({success:false, msg:'server error occured'})
}

       const checktoken =  await registermodel.findOne({_id:id},'token email')
       
         if(checktoken.token !== token || checktoken.email !== email || checktoken.token == 'empty'){
          return res.json({
            success:false,
            msg:'URL is Expired !'
          })
         }
       

           addEvent(id , "password changed with URL")
        await registermodel.findByIdAndUpdate(id,{password:hash,token:'empty'})
        console.log('password changed successfully')
        return res.json({success:true,msg:"Password Changed Successfully"
        })
      
      
  } catch (err) {
    
      if (err.name === 'TokenExpiredError') {
        console.log('Token has expired');
      return  res.json({success:false,msg:'Token is Expired'})
      } else if(err.name === 'JsonWebTokenError') {
        console.log('Invalid token');
      return  res.json({success:false,msg:'Not a valid password change URL'})
      }else{
        console.log(err);
       return res.json({success:false,msg:'Server Error Occured !'})

      }
    }
  
   
}


const removeAccount = async (req,res)=>{
      try {
        const id = req.body.data;
       
        if(!id){
          return res.json({success:false,msg:'Invalid Input data'})
        }
        await registermodel.findByIdAndDelete(id )
          addEvent(id ,'Account Removed by user')
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
  return res.json({success:false,msg:"Data not Found"});
}
const tokenData =await checkToken(data)
if(!tokenData || !tokenData._id){
  return res.json({success:false,msg:"Authorization failure !"})
}
const dataUpdate = await registermodel.findByIdAndUpdate(tokenData._id,{name:data.name , contact:data.contact},{new:true})
if(dataUpdate){
  addEvent(tokenData._id , 'Profile Data Update')
  return res.json({success:true,msg:'User Details Changed Successfully',tokenData})
}else{

  return res.json({success:false,msg:'Error in update details' })
}


  } catch (error) {
    console.log(error)
    return res.json({success:false , msg:'server Error Occured'})
  }
}

const logout= async (req,res) => {
  const {id} = req.body;
   addEvent(id, 'Logged Out')
   
}


module.exports = { Signin, Login,getUserData,resetPassword ,getOTP,changePassword,removeAccount,edituser,logout};
