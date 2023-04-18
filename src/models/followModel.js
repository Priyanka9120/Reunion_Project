//=====================Importing Packages=====================//
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId



//=====================Creating User's Schema=====================//
const followModel = new mongoose.Schema({

  userID: {
    type: ObjectId,
    ref: 'User'
  },

  followUserId: {
    type: ObjectId,
    ref: 'User'
  },

  status: {
    type: String,
    required: true,
    enum: ["follow", "unfollow"]
  }


}, { timestamps: true });




//=====================Module Export=====================//
module.exports = mongoose.model('Follower', followModel)




