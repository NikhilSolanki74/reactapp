const express= require('express')
const app = express()
const cors = require('cors');
const {db} = require('./dbConnection/db')
db();
app.use(express.json())
// app.use(cors());



app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization, Origin, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
  });

app.use('/api/v1/user/',require('./Routes/Route'))
app.use('/api/v1/admin/',require('./Routes/AdminRoute'))
app.use('/api/v1/seller/',require('./Routes/SellerRoute'))
app.listen('4000',(err)=>{
    if(err){
        console.log(err)
    }else{

        console.log('app is running on port:4000')
    }
})

