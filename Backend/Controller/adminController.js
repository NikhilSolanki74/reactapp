const { registermodel ,useractivity} = require("../dbConnection/db");
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
            // console.log('data succccess',data,'end')
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
  //  console.log(verify,'heheh')
  if(!verify){
    return res.json({success:false , msg:'User Not Verified'})
  }

    
    const limit = data.limit || 13;
    const offset = data.offset || 0;


  const userdata = await registermodel.find({status:'0'},'name email contact registeredOn').limit(limit).skip(offset)
  const count  = await registermodel.countDocuments({status:{$eq:'0'}})
  const pages = Math.ceil(count/limit)
  // console.log(count, 'hellll')
   if(userdata){
     return res.json({success:true , msg:"data fetched Successfully",userdata ,pages,count })

   }else{
    return res.json({success:false , msg:'Data Not Found !'})

   }

  } catch (error) {
    console.log(error)
  return  res.json({success:false, msg:"Error in Fetching Data"})
  }
}


const getRegisteredSeller =async (req ,res) =>{
  try {

    const data = req.body;
    if(!data){
    return res.json({success:false , msg:'User Not Verified'})
    }
  //  console.log(data);
   const verify = await checkToken(data)
  //  console.log(verify,'heheh')
  if(!verify){
    return res.json({success:false , msg:'User Not Verified'})
  }

    
    const limit = data.limit || 13;
    const offset = data.offset || 0;


  const userdata = await registermodel.find({status:'2'},'name email contact registeredOn').limit(limit).skip(offset)
  const count  = await registermodel.countDocuments({status:{$eq:'2'}})
  const pages = Math.ceil(count/limit)
  // console.log(count, 'hellll')
   if(userdata){
     return res.json({success:true , msg:"data fetched Successfully",userdata ,pages,count })

   }else{
    return res.json({success:false , msg:'Data Not Found !'})

   }

  } catch (error) {
    console.log(error)
  return  res.json({success:false, msg:"Error in Fetching Data"})
  }
}




const getChart =async (req,res) => {
  
  // console.log('value',req.body);
  try {
    const token = req.body;
  const chk =await checkToken(token);
  if(!chk){
return res.json({success:false, msg:'Invalid User !'})
  }
  const country =await registermodel.aggregate([{
    $group:{
         _id:"$country",
          count:{$sum:1}
    }
   }
    ])
    let countrydata = {};

     country.forEach((doc)=>{
      const dd = doc._id
       countrydata[dd] = doc.count;
      // countrydata[doc._id] = doc.count
     })
  //  console.log(countrydata);
   const total = await registermodel.countDocuments({}) 
 
   const datetoday =new Date();
      const date = new Date(datetoday.setHours(0,0,0,0));
      const Mdate = Math.floor(date.getTime()/1000);
      const Ndate = Mdate + 86400;
// return console.log(Mdate);
   const activeUser = await useractivity.aggregate([
    {
           $match:{
            createdAt:{$gt:Mdate,$lt:Ndate}
           }
   },{
           $group:{
            _id:"$userId"
            
           }
     },
    {
            $count:'activeUser'
   }
        ]) || [{avtiveUser:0}]


const today = new Date();
const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const startmonth = Math.floor(firstDayOfMonth.getTime() / 1000);


const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0,23,59,59,999);
const endmonth = Math.floor(lastDayOfMonth.getTime() / 1000);

        const Mactive = await useractivity.aggregate([
          {
                 $match:{
                  createdAt:{$gt:startmonth,$lt:endmonth}
                 }
         },{
                 $group:{
                  _id:"$userId"
                  
                 }
           },
          {
                  $count:'Mactive'
         }
              ]) || [{ Mactive: 0 }];
//  console.log(activeUser);

   const a = activeUser.length === 0 ? [{activeUser:0}] : activeUser ;
   const b = Mactive.length === 0 ? [{Mactive:0}] : Mactive ;

 return res.json({success:true ,countrydata , total,activeUser:a,Mactive:b})
    
  } catch (error) {
    console.log(error);
   return res.json({success:false ,msg:'Server Error Occured'})
  }
  
}


const getEngagmentTime = async (req,res) =>{
  try {
    const token = req.body;
  const chk =await checkToken(token);
  if(!chk){
return res.json({success:false, msg:'Invalid User !'})
  }
    

 const time = new Date();
 const ctime = Math.floor(time.getTime()/1000);

  const ptime = ctime - 86400;
 const eng =  await useractivity.aggregate([
  {
    $group: {
      _id: "$userId",
      timestamps: { $addToSet: "$createdAt" }
    }
  },
  {
    $project: {
      _id: 1,
      timestamps: {
        $filter: {
          input: "$timestamps",
          as: "timestamp",
          cond: {
            $and: [
              { $gte: ["$$timestamp", ptime] },
              { $lte: ["$$timestamp",ctime ] }
            ]
          }
        }
      }
    }
  },
  {
    $project: {
      _id: 1,
      timestamps: { $sortArray: { input: "$timestamps", sortBy: 1 } }
    }
  },
  {
    $sort: { _id: -1 }
  },
  {
    $limit: 50
  }
])

  let count = 0;
  const avg = [];

  eng.forEach((doc)=>{
       const arr = doc.timestamps;
      //  let count = 0;
       for(let i =0; i<arr.length-1;i++){
          const n1 = arr[i+1]- arr[i];
          if(n1<=300){
               count += n1;
          }
       }
       avg.push(count);
       count=0;
  })
    
  // console.log(avg)
  let totalTime =0;
   for(let i=0; i<avg.length ; i++){
      totalTime += avg[i];
   }
    const t = Math.round(totalTime/avg.length);
  //  const t = 7666;
      const hour = Math.floor(t/3600)
      const minute = Math.floor((t % 3600)/60);
      const second = ((t%3600)%60);
      // console.log(minute,' ',second,'',t)

  return res.json({success:true,hour , minute, second})
  } catch (error) {
    console.log(error);
   return res.json({success:false ,msg:'Server Error Occured'})
  }
  
}

const getLine = async (req,res) =>{
try {
  const token = req.body;
  const chk =await checkToken(token);
  if(!chk){
return res.json({success:false, msg:'Invalid User !'})
  }
   

  const d = new Date();
  const cd = new Date(d.getFullYear(),d.getMonth(),d.getDate())
const date =Math.floor((cd.getTime()/1000)-1);
const dayArr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// console.log(dayArr[d.getDay()])
  const days = [];
  const userCount = [];
  const day = 86400;
  let startdate = date;
  let backdate = startdate - day ;
  for(let i=0;i<7;i++){
      const dt =await useractivity.aggregate([
        {
          $match:{
            createdAt:{$lt:startdate,$gt:backdate}
          }
        },{
          $group:{
          _id:'$userId'
          //  count:{$sum:1}
          }
        }
      ])
       const td = new Date(startdate*1000);
       days.push(dayArr[td.getDay()]);
       userCount.push(dt.length);
      // arr[dayArr[td.getDay()]] = dt.length;

      startdate = backdate;
      backdate = startdate - day;
  }
if(!days && !userCount){
  return res.json({success:false});
}

days.reverse();
userCount.reverse();

return res.json({success:true,days:days ,userCount:userCount})  

} catch (error) {
  console.log(error);
  return res.json({success:false,msg:'Server Error Occured!'});
}
}


const getLineBar = async (req,res) =>{
    try {
      const token = req.body;
      const chk =await checkToken(token);
      if(!chk){
    return res.json({success:false, msg:'Invalid User !'})
      }


      const d = new Date();
      const cd = new Date(d.getFullYear(),d.getMonth(),d.getDate())
    const date =Math.floor((cd.getTime()/1000)-1);
    const dayArr = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    // console.log(dayArr[d.getDay()])
      const days = [];
      const userCount = [];
      const day = 86400;
      let startdate = date;
      let backdate = startdate - day ;
      for(let i=0;i<7;i++){
          const dt =await useractivity.aggregate([
            {
              $match:{
                createdAt:{$lt:startdate,$gt:backdate},
                action:{$eq:'New Register'}
              }
            },{
              $group:{
              _id:'$userId'
              //  count:{$sum:1}
              }
            }
          ])
           const td = new Date(startdate*1000);
           days.push(dayArr[td.getDay()]);
           userCount.push(dt.length);
          // arr[dayArr[td.getDay()]] = dt.length;
    
          startdate = backdate;
          backdate = startdate - day;
      }
    if( !userCount){
      return res.json({success:false});
    }


const dt =await useractivity.aggregate([
            {
              $match:{
                createdAt:{$lt:(d.getTime()/1000),$gt:(date+1)},
                action:{$eq:'New Register'}
              }
            },
            {
              $group:{
                _id:"$userId"
              }
            }
          ])

          const register = dt.length;
    
    days.reverse();
    userCount.reverse();
    


    // console.log(days,' ',userCount)


      return res.json({success:true,userCount:userCount,days:days,register:register})
    } catch (error) {
      console.log(error);
      return res.json({success:false,msg:'Server Error Occured!'});
    }
}


module.exports = {getAdminData,removeAccount,edituser,getRegisteredUser,getChart,getLine,getEngagmentTime,getLineBar,getRegisteredSeller}