const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  } , 
  following : {
    type: Boolean , 
    default: true 
  }
}, {
  collection: 'followers' // specify the collection name here
});

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;
