const express= require('express')
const app = express()
const cors = require('cors');
const {db} = require('./dbConnection/db')
db();
app.use(express.json())
app.use(cors());

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

