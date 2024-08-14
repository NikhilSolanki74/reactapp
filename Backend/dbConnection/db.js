require("dotenv").config();
const mongoose = require("mongoose");

const model = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contact: { type: Number, required: true },
  token:{type:String ,default:'empty'}
});

const registermodel = mongoose.model("registermodel", model);

const db = async () => {
  await mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      console.log("database connection successfull");
    })
    .catch((err) => {
      console.log("error in database connection", err);
    });
};

module.exports = { registermodel, db };
