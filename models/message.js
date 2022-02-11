const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
msg : {
    type:String,
}
});

const Message = mongoose.model('messages' , messageSchema);

module.exports = Message;