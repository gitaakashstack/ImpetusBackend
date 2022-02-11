const mongoose = require("mongoose");

const caSchema = new mongoose.Schema({
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
    required : true,
  },
});

const Cambass = mongoose.model('CAMPUSS AMBASSADOR' , caSchema);

module.exports = Cambass;