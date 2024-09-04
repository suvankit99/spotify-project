const Playlist = require("../models/Playlist");
const mongoose = require("mongoose");

const addPlaylist = async (ctx) => {
  const { name, description, imagePath } = ctx.request.body;
  let owner = ctx.request.body.owner;
  if (!owner) owner = new mongoose.Types.ObjectId("66cb7fe5e849bc2edfff47ca");
  try {
    const newPlaylist = new Playlist({
      name: name,
      description: description,
      imagePath: imagePath,
      owner: owner,
      songs: [],
    });
    await newPlaylist.save();
    ctx.body = {
      message: "Playlist created successfully",
      playlist: newPlaylist,
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: "Error creating playlist", error };
    console.log(error.message);
  }
};

const fetchPlaylists = async (ctx) => {
  try {
    const playlists = await Playlist.find({});
    ctx.body = {
      playlists: playlists,
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = {
      error: error,
    };
  }
};

// PUT request handler to add a new song to a playlist
const addSongToPlaylist = async (ctx) => {
  console.log(ctx.request.body);
  const { playlistId, newSongId } = ctx.request.body;
  console.log(ctx.request.body.playlistId);
  console.log(ctx.request.body.newSongId);
  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(newSongId)
  ) {
    console.log("Invalid ids provided");
    ctx.status = 400;
    ctx.body = { error: "Invalid playlistId or newSongId" };
    return;
  }
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { songs: newSongId } },
      { new: true } // Return the updated document
    );
    console.log("Updated playlist", updatedPlaylist);
    if (!updatedPlaylist) {
      ctx.status = 404;
      ctx.body = { error: "Playlist not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      message: "Song added to playlist successfully",
      playlist: updatedPlaylist,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
};

const fetchSinglePlaylist = async (ctx) => {
  try {
    const { id } = ctx.params;
    const playlist = await Playlist.findById(id, { songs: 0 });

    if (!playlist) {
      ctx.status = 404;
      ctx.body = { error: "Playlist not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = playlist;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
};

const fetchPlaylistsOfOwner = async (ctx) => {
  const ownerId = ctx.request.params.id;
  try {
    const response = await Playlist.find({ owner: ownerId });
    ctx.body = response;
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      error: error.message,
    };
  }
};

const togglePlaylistVisibility = async (ctx) => {
  const { playlistId } = ctx.request.params;
  try {
    const foundPlaylist = await Playlist.findById(playlistId);
    if (!foundPlaylist) {
      ctx.status = 404;
      ctx.body = {
        error: "No such playlist found with given id",
      };
    }

    foundPlaylist.isPublic = !foundPlaylist.isPublic;
    foundPlaylist.save();
    ctx.body = foundPlaylist;
  } catch (error) {
    ctx.body = {
      error: error.message,
    };
  }
};

const getPublicPlaylistsByUserId = async (ctx) => {
  const { id } = ctx.request.params;
  try {
    const publicPlaylists = await Playlist.find({ owner: id, isPublic: true });
    ctx.body = publicPlaylists;
  } catch (error) {
    ctx.body = {
      error: error.message,
    };
  }
};

const getPaginatedPlaylists = async (ctx) => {
  const { page, limit } = ctx.params;

  try {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const playlists = await Playlist.find({})
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalPlaylists = await Playlist.countDocuments({});

    ctx.status = 200;
    ctx.body = {
      success: true,
      playlists,
      totalPlaylists,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalPlaylists / limitNumber),
    };
  } catch (error) {
    console.error("Error fetching playlists:", error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "Error fetching playlists",
      error: error.message,
    };
  }
};

const getPaginatedSongsOfSinglePlaylist = async (ctx) => {
  // const { playlistId, page = 1, limit = 8 } = ctx.query;
  const { playlistId, page, limit } = ctx.request.params;
  // console.log(ctx.query) ;
  try {
    const playlist = await Playlist.findById(playlistId)
      .populate({
        path: "songs",
        options: {
          skip: (page - 1) * limit,
          limit: parseInt(limit),
        },
      })
      .exec();

    if (!playlist) {
      ctx.status = 404;
      ctx.body = { message: "Playlist not found" };
      return;
    }

    ctx.body = {
      songs: playlist.songs,
      hasNextPage: playlist.songs.length === parseInt(limit),
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "Server error", error };
  }
};

const addSongToLikedSongs = async (ctx) => {
  try {
    const { userId, songId } = ctx.request.body;

    // Check if there's a playlist with isLikedSongsPlaylist: true for this user
    let likedSongsPlaylist = await Playlist.findOne({
      owner: userId,
      isLikedSongsPlaylist: true,
    });

    // If the playlist doesn't exist, create a new one
    if (!likedSongsPlaylist) {
      likedSongsPlaylist = new Playlist({
        name: "Liked Songs",
        description: "Your liked songs",
        imagePath: "http://localhost:5000/spotify_liked_songs.jpeg", // Provide a default image path if needed
        owner: new mongoose.Types.ObjectId(userId),
        isPublic: false,
        isLikedSongsPlaylist: true,
        songs: [],
      });

      await likedSongsPlaylist.save();
    }

    // Check if the songId already exists in the songs array of this playlist
    const songObjectId = new mongoose.Types.ObjectId(songId);
    const songExists = likedSongsPlaylist.songs.includes(songObjectId);

    if (!songExists) {
      // If the song is not in the playlist, add it
      likedSongsPlaylist.songs.push(songObjectId);
      await likedSongsPlaylist.save();
      ctx.body = { added: true, message: "Song added to liked songs playlist" };
    } else {
      ctx.body = {
        added: false,
        message: "Song already in liked songs playlist",
      };
    }
  } catch (error) {
    console.error("Error in addSongToLikedSongs:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};

const removeSongFromPlaylist = async (ctx) => {
  const { songId, playlistId  , owner} = ctx.request.body;

  try {
    // Find the playlist and remove the songId from the songs array if it exists
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      {_id:playlistId , owner:owner} , 
      { $pull: { songs: songId } },
      { new: true } // This option returns the modified document
    );

    if (!updatedPlaylist) {
      ctx.status = 404;
      ctx.body = { message: "Playlist not found" };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      message: "Song removed from playlist successfully",
      updatedPlaylist,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: "An error occurred while removing the song", error };
  }
};

module.exports = {
  getPaginatedSongsOfSinglePlaylist,
  getPaginatedPlaylists,
  getPublicPlaylistsByUserId,
  togglePlaylistVisibility,
  addPlaylist,
  fetchPlaylists,
  addSongToPlaylist,
  fetchSinglePlaylist,
  fetchPlaylistsOfOwner,
  addSongToLikedSongs,
  removeSongFromPlaylist,
};
