const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true },
  songPath: { type: String, required: true },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: true,
  },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  duration: { type: Number, required: true, default: 0 },
  genre: [{ type: String, default: [] }],
  language: { type: String },
});

const Song = mongoose.model("Song", songSchema, "songs");

module.exports = Song;
