const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: {type:String , required : true},
  imagePath: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  isPublic:{type:Boolean , default:false},
  isLikedSongsPlaylist:{type:Boolean , default:false}
});

const Playlist = mongoose.model("Playlist", playlistSchema , 'playlists');

module.exports = Playlist;
