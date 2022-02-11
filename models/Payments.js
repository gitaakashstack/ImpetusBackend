const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  eventName: {
    type: String,
    required : true,
  },
  order_id : {
    type: String,
    required : true,  
  },
  payment_id : {
    type: String,
    required : true,  
  }
});

const Paid = mongoose.model('PAYMENTS' , paymentSchema);

module.exports = Paid;