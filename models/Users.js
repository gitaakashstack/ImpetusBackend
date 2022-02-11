const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute : {
    type:String,
    required:true,
  },
  branch : {
    type:String,
    required:true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  referralCode: {
    type: String
  },
  // events : [{
  //     eventName:String,
  //     order_id : String, 
  //     payment_id : String
  //   }]
});

const User = mongoose.model('USER' , userSchema);

module.exports = User;