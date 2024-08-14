const express= require('express')
const app = express()
const cors = require('cors');
// const bodyParser = require('body-parser');
const {db} = require('./dbConnection/db')
db();
app.use(express.json())
app.use(cors());

app.use('/api/v1/',require('./Routes/Route'))

app.listen('4000',(err)=>{
    if(err){
        console.log(err)
    }else{

        console.log('app is running on port:4000')
    }
})

