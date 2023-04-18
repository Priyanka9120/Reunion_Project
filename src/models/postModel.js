//=====================Importing Packages=====================//
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId



//=====================Creating Post's Schema=====================//
const postModel = new mongoose.Schema({

  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  likes: [{
    userId: { type: ObjectId, ref: 'User' },
    status: { type: String, enum: ['like', 'unlike'] },
    _id: false
  }],

  comments: [{
    userId: { type: ObjectId, ref: 'User' },
    comment: { type: String }
  }],

  isDeleted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });



//=====================Module Export=====================//
module.exports = mongoose.model('Post', postModel)





