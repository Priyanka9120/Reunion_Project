//=====================Importing Packages=====================//
const mongoose = require('mongoose')



//=====================Creating User's Schema=====================//
const userModel = new mongoose.Schema({
  
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  // //friends (an array of user IDs referencing other User documents)
  // friends: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }],

  // // posts (an array of post IDs referencing Post documents)
  // posts: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Post'
  // }]


}, { timestamps: true });




//=====================Module Export=====================//
module.exports = mongoose.model('User', userModel)




