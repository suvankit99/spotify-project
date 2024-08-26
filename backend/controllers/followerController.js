const Follower = require('../models/Follower');
const mongoose = require('mongoose');
const User = require('../models/User');

const addFollower = async (ctx) => {
  const { followerId, followeeId } = ctx.request.body;

  try {
    // Check if a document with the given followerId and followeeId exists
    let followerDoc = await Follower.findOne({ followerId, followeeId });

    if (followerDoc) {
      // If it exists, toggle the "following" field
      followerDoc.following = !followerDoc.following;
      await followerDoc.save();

      // If following is toggled to true, increment counts; otherwise, decrement counts
      const incrementValue = followerDoc.following ? 1 : -1;

      await User.findByIdAndUpdate(followerId, { $inc: { followingCount: incrementValue } });
      await User.findByIdAndUpdate(followeeId, { $inc: { followerCount: incrementValue } });

      ctx.body = { message: 'Follower relationship toggled', data: followerDoc };
    } else {
      // If it doesn't exist, add a new document with the given fields
      followerDoc = new Follower({ followerId, followeeId, following: true });
      await followerDoc.save();

      // Increment the counts
      await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
      await User.findByIdAndUpdate(followeeId, { $inc: { followerCount: 1 } });

      ctx.body = { message: 'Follower relationship created', data: followerDoc };
    }

    ctx.status = 200;
  } catch (error) {
    console.error('Error adding follower relationship:', error);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};

const checkFollowing = async ( ctx ) => {
  const {followerId , followeeId } = ctx.request.body ; 
  try {
    const exists = await Follower.exists({ followerId:followerId, followeeId:followeeId , following:true});
    ctx.body = {
      exists : exists ? true : false 
    }
  } catch (error) {
    ctx.status = 500 ; 
    ctx.body = {
      error : error.message 
    }
  }
}
module.exports = { addFollower , checkFollowing};
