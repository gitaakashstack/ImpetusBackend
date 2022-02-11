const mongoose = require("mongoose");

const leadershipSchema = new mongoose.Schema({
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
  referralCode: {
    type: String,
    required : true,
  },
  score: {
    type: Number,
  }
});

const LeaderShipSchema = mongoose.model('LEADERSHIPS' , leadershipSchema);

module.exports = LeaderShipSchema;