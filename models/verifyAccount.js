const mongoose = require("mongoose");

const verifySchema = new mongoose.Schema({
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
    type: String,
  },
  code : {
    type : String,
    required : true
  }
});

const Verify = mongoose.model('VERIFY' , verifySchema);

module.exports = Verify;