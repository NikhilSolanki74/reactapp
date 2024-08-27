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


const db = async () => {
  await mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      console.log("database connection successfull");
    })
    .catch((err) => {
      console.log("error in database connection", err);
    });
};

module.exports = { registermodel, db ,useractivity};
