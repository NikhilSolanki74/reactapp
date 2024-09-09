require("dotenv").config();
const mongoose = require("mongoose");

const model = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contact: { type: Number, required: true },
  token:{type:String ,default:'empty'},
  status:{type:String ,default:'0'},
  country:{type:String , default:'India'}
});
const registermodel = mongoose.model("registermodel", model);



const model2 = new mongoose.Schema({
  userId:{type:String,required:true},
  action:{type:String, required:true},
  createdAt:{type:Number ,required:true}
});
const useractivity = mongoose.model("useractivity", model2);



const model3 = new mongoose.Schema({
  sellerId:{type:String,require:true},
  sellerName:{type:String,required:true},
  product:{type:String, required:true},
  image:{type:String ,default:'https://res.cloudinary.com/dzjvyptwz/image/upload/v1720615989/1720615988241bs.jpg.jpg'},
  images:{type:Array,default:[]},
  price:{type:Number,required:true},
  stock:{type:Number,required:true},
 description:{type:String,default:'this is the sample product in store'},
  onMarket:{type:Number,default:'1'},
  createdAt:{type:Date , default:Date.now()}
});
const productTable = mongoose.model("productTable", model3);



const model4 = new mongoose.Schema({
  SellerId:{type:String,required:true},
  action:{type:String, required:true},
  createdAt:{type:Number ,required:true}
});
const selleractivity = mongoose.model("selleractivity", model4);



const model5 = new mongoose.Schema({
  userId:{type:String,required:true},
  itemCount:{type:Number,required:true},
  itemsId:{type:Object,default:{}},
})
const userCart = mongoose.model("userCart",model5)



const model6 = new mongoose.Schema({
  sellerId:{type:String, required:true},
  customerId:{type:String,required:true },
  productId:{type:String,required:true},
  count:{type:Number,required:true},
  price:{type:Number,required:true},
  otp:{type:Number,required:true}
})
const orderTable = mongoose.model("orderTable",model6)





const db = async () => {
  await mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      console.log("database connection successfull");
    })
    .catch((err) => {
      console.log("error in database connection", err);
    });
};

module.exports = {  db ,registermodel,useractivity,productTable , selleractivity,userCart,orderTable};
