const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  followerCount:{
    type:Number , 
    default:0
  },
  followingCount: {
    type:Number , 
    default:0
  },
  playlists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },
  ],
  recentlyListenedSongs : [
    {
      type:mongoose.Schema.Types.ObjectId , 
      ref: "Song"
    }
  ]
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
