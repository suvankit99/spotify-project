const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const mongoose = require("mongoose");
const { getAudioDuration } = require("../utils/extractDuration");
const User = require("../models/User");

const addSong = async (ctx) => {
  const { songName, songDescription, songPath, imagePath, playlist , duration , genre , language} =
    ctx.request.body.data;

    if(!songName || !songDescription || !songPath || !imagePath || !playlist || !duration || !genre || !language){
      ctx.status = 500 ; 
      ctx.body = {
        error : "Missing fields"
      }
      return ; 
    }
  const playlistId = new mongoose.Types.ObjectId(playlist);
  const artistId = ctx.request.body.data.artist
    ? new mongoose.Types.ObjectId(ctx.request.body.data.artist)
    : new mongoose.Types.ObjectId("66cb7fe5e849bc2edfff47ca");

  try {
    const newSong = new Song({
      name: songName,
      description: songDescription,
      imagePath: imagePath,
      songPath: songPath,
      playlist: playlistId,
      artist: artistId,
      duration:duration,
      genre: genre , 
      language : language 
    });
    await newSong.save();
    ctx.body = { message: "Song created successfully", song: newSong };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: "Error creating song", error };
    console.log(error.message);
  }
};

const fetchSongs = async (ctx) => {
  try {
    const songsList = await Song.find({});
    ctx.body = {
      songs: songsList,
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = {
      error: error,
    };
  }
};

const getNextSong = async (ctx) => {
  const selectedSong = ctx.request.body;
  try {
    const response = await Song.findById(
      { _id: selectedSong._id },
      { playlist: 1, _id: 0 }
    );
    const playlistId = response.playlist;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      ctx.body = {
        error: "No such playlist",
      };
      return;
    }

    // Find the index of the currentId in the songs array
    const currentIndex = playlist.songs.indexOf(selectedSong._id);

    if (currentIndex === -1) {
      return { error: "Current song not found in playlist" };
    }

    const totalSongs = playlist.songs.length;

    const nextIndex = (currentIndex + 1) % totalSongs;

    const nextSongObjectId = playlist.songs[nextIndex];

    const nextSong = await Song.findById(nextSongObjectId);

    ctx.body = nextSong;
  } catch (error) {
    ctx.body = {
      error: error.message,
    };
  }
};

const getPreviousSong = async (ctx) => {
  const selectedSong = ctx.request.body;
  try {
    const response = await Song.findById(
      { _id: selectedSong._id },
      { playlist: 1, _id: 0 }
    );
    const playlistId = response.playlist;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      ctx.body = {
        error: "No such playlist",
      };
      return;
    }

    // Find the index of the currentId in the songs array
    const currentIndex = playlist.songs.indexOf(selectedSong._id);

    if (currentIndex === -1) {
      return { error: "Current song not found in playlist" };
    }

    const totalSongs = playlist.songs.length;

    const previousIndex = (currentIndex - 1 + totalSongs) % totalSongs;

    const previousSongObjectId = playlist.songs[previousIndex];

    const previousSong = await Song.findById(previousSongObjectId);

    ctx.body = previousSong;
  } catch (error) {
    ctx.body = {
      error: error.message,
    };
  }
};

const getRandomSong = async (ctx) => {
  const selectedSong = ctx.request.body;
  try {
    const response = await Song.findById(
      { _id: selectedSong._id },
      { playlist: 1, _id: 0 }
    );
    const playlistId = response.playlist;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      ctx.body = {
        error: "No such playlist",
      };
      return;
    }

    // Find the index of the currentId in the songs array
    const currentIndex = playlist.songs.indexOf(selectedSong._id);

    if (currentIndex === -1) {
      return { error: "Current song not found in playlist" };
    }

    const totalSongs = playlist.songs.length;

    const nextIndex = (currentIndex + Math.floor(Math.random() * totalSongs) + 1) % totalSongs;

    const nextSongObjectId = playlist.songs[nextIndex];

    const nextSong = await Song.findById(nextSongObjectId);

    ctx.body = nextSong;
  } catch (error) {
    ctx.body = {
      error: error.message,
    };
  }
}

const getSongsByGenre = async (ctx) => {
  const { type, name } = ctx.request.params;

  try {
      let results;

      if (type === 'genre') {
          // Fetch songs where the 'genre' array contains the specified 'name'
          results = await Song.find({ genre: { $in: [name] } });
      } else if (type === 'language') {
          // Fetch songs where the 'language' field is equal to the specified 'name'
          results = await Song.find({ language: name });
      } else {
          ctx.status = 400;
          ctx.body = {
              error: 'Invalid type specified. Must be either "genre" or "language".'
          };
          return;
      }

      ctx.status = 200;
      ctx.body = {
          results
      };
  } catch (error) {
      ctx.status = 500;
      ctx.body = {
          error: error.message
      };
  }
};


const getUserRecentlyListenedSongs = async (ctx) => {
  const { userId } = ctx.request.params;

  try {
      // Fetch the user by _id, project only the recentlyListenedSongs field, and populate it
      const user = await User.findById(userId, 'recentlyListenedSongs')
                             .populate('recentlyListenedSongs');

      if (!user) {
          ctx.status = 404;
          ctx.body = {
              error: 'User not found'
          };
          return;
      }

      // Return only the recentlyListenedSongs array
      ctx.status = 200;
      ctx.body = {
          recentlyListenedSongs: user.recentlyListenedSongs
      };
  } catch (error) {
      ctx.status = 500;
      ctx.body = {
          error: error.message
      };
  }
};

const getPaginatedSongs = async (ctx) => {
  const { page, limit } = ctx.params;

  try {
    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Fetch the songs with pagination
    const songs = await Song.find({})
      .skip((pageNumber - 1) * limitNumber) // Skip documents to implement pagination
      .limit(limitNumber); // Limit the number of documents returned

    // Optionally, you could get the total count of songs for more robust pagination
    const totalSongs = await Song.countDocuments({});

    ctx.status = 200;
    ctx.body = {
      success: true,
      songs,
      totalSongs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalSongs / limitNumber)
    };
  } catch (error) {
    console.error('Error fetching songs:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error fetching songs',
      error: error.message
    };
  }
}

const fetchSongsByArtist = async (ctx) => {
  const { artistId } = ctx.params; // Extract artistId from request params
  try {
    // Find all songs where the artist field matches the artistId
    const songs = await Song.find({ artist: artistId });

    // Send the list of songs as a response
    ctx.status = 200;
    ctx.body = {
      success: true,
      songs: songs,
    };
  } catch (error) {
    console.error("Error fetching songs by artist:", error);

    // Handle errors and send an error response
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: "Failed to fetch songs by artist",
      error: error.message,
    };
  }
};

const deleteSongById = async (ctx) => {
  const { songId } = ctx.request.params; 

  try {
    // Ensure songId is a valid MongoDB ObjectId
    if (!songId) {
      ctx.status = 400;
      ctx.body = { message: 'Song ID is required' };
      return;
    }

    // Find and delete the song by ID
    const result = await Song.findByIdAndDelete(songId);

    if (!result) {
      ctx.status = 404;
      ctx.body = { message: 'Song not found' };
      return;
    }

    // Successful deletion
    ctx.status = 200;
    ctx.body = { message: 'Song deleted successfully' };

  } catch (error) {
    console.error('Error deleting song:', error);
    ctx.status = 500;
    ctx.body = { message: 'Error deleting song. Please try again later.' };
  }
};


module.exports = {deleteSongById ,fetchSongsByArtist , getPaginatedSongs , addSong, fetchSongs, getNextSong, getPreviousSong , getRandomSong , getSongsByGenre , getUserRecentlyListenedSongs};
