const Koa = require('koa');
const Router = require('koa-router');
const {koaBody} = require('koa-body'); // To handle multipart form data
const bodyParser = require('koa-bodyparser'); // To parse JSON request bodies
const mongoose = require('mongoose');
const cors = require('@koa/cors'); // Import koa-cors
const User = require('./models/User'); // Import the User model
const { connectToDatabase } = require('./utils/connectDB'); // Import the connectToDatabase function
const { addUser, authUser, getUserById, updateUserRecentlyListened } = require('./controllers/userControllers');
const path = require('path');
const Song = require('./models/Song') ; 
const { addSong, fetchSongs, getNextSong, getPreviousSong, getRandomSong, getSongsByGenre, getUserRecentlyListenedSongs, getPaginatedSongs, fetchSongsByArtist, deleteSongById } = require('./controllers/songControllers');
const app = new Koa();
const router = new Router();
const {addPlaylist, fetchPlaylists, addSongToPlaylist, fetchSinglePlaylist, fetchPlaylistsOfOwner, togglePlaylistVisibility, getPublicPlaylistsByUserId, getPaginatedPlaylists, getPaginatedSongsOfSinglePlaylist, addSongToLikedSongs, removeSongFromPlaylist, deletePlaylistById} = require('./controllers/playlistControllers');
const { addFollower,checkFollowing, getFriends, getFollowers, getFollowing } = require('./controllers/followerController');
const { getSearchResults } = require('./controllers/searchController');
const { authMiddleware, checkAdmin } = require('./controllers/authController') ; 
const { updateUserFrequentGenres, getSongRecommendations } = require('./controllers/userGenrePreferenceController');
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import socket.io
const cloudinary = require('./utils/cloudinaryConfig'); // Import the Cloudinary configuration

// // Connect to DB
connectToDatabase();

// // Handle CORS errors
app.use(cors({
  origin: '*', // Replace with your React app's URL
  credentials: true, // Allow credentials like cookies to be sent
}));

app.use(koaBody({
  multipart: true, // Enables multipart form data parsing
  formidable: {
    uploadDir: path.join('/home/suvankitsahoo/Desktop/spotify project/backend/uploads/'), // Directory where files will be temporarily stored
    keepExtensions: true,   // Keep file extensions
  },
}));

// song routes
router.post('/api/song/' , addSong) ; 

router.get('/api/song/' , fetchSongs) ;

router.post('/api/song/next' ,  getNextSong) ; 

router.post('/api/song/previous' ,  getPreviousSong) ; 

router.post('/api/song/random',  getRandomSong);

router.get('/api/song/genre/:type/:name' , getSongsByGenre) ; 

router.get('/api/song/recent/:userId' , getUserRecentlyListenedSongs) ; 

router.get('/api/song/:page/:limit' , getPaginatedSongs) ; 

router.get('/api/artist/:artistId' , fetchSongsByArtist); 

router.delete('/api/song/:songId' , deleteSongById) ; 
// playlist routes 
router.post('/api/playlist' , addPlaylist) ; 

router.get('/api/playlist' , fetchPlaylists) ; 

router.put('/api/playlist', addSongToPlaylist);

router.get('/api/playlist/:id' , fetchSinglePlaylist) ; 

router.get('/api/playlist/:playlistId/:page/:limit' , getPaginatedSongsOfSinglePlaylist) ;

router.get('/api/playlist/owner/:id',  fetchPlaylistsOfOwner);

router.put('/api/playlist/toggle/:playlistId', togglePlaylistVisibility);

router.get('/api/playlist/public/:id' , getPublicPlaylistsByUserId);

router.get('/api/playlist/:page/:limit' , getPaginatedPlaylists) ;

router.put('/api/playlist/remove-song' , removeSongFromPlaylist);

router.delete('/api/playlist/:playlistId' , deletePlaylistById) ; 

// user routes 

router.get('/api/user/:id' , getUserById)

router.put('/api/user/recent' , updateUserRecentlyListened);

router.post('/api/login/', authUser);

router.post('/api/signup/', addUser);

// follower routes 

router.put('/api/follow', addFollower) ; 

router.post(`/api/follow/check`, checkFollowing);

router.get('/api/followers/:userId' , getFollowers) ; 

router.get('/api/following/:userId' , getFollowing) ; 

// search routes

router.get('/api/search/:searchInput/:selectedFilter' , getSearchResults)

// user genre preference 

router.put('/api/frequent-genre' , updateUserFrequentGenres) ; 

router.get('/api/frequent-genre/:userId' , getSongRecommendations) ; 

// liked songs routes 

router.put('/api/likedSongs' , addSongToLikedSongs)

// POST route for /api/upload/
router.post('/api/upload/', async (ctx) => {
  const file = ctx.request.files.file; // Assuming the input field name is 'file'
  // ctx.body = { message: 'File uploaded successfully', file: file.filepath };
  try {
    // const result = await cloudinary.uploader.upload(file.filepath);
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'spotify',
      resource_type: 'auto', // Allows for both images and audio
    });

    const fs = require('fs');
    fs.unlinkSync(file.filepath);

    ctx.body = {
      message: 'File uploaded successfully',
      url: result.secure_url,
    };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = {
      message: 'Failed to upload file',
    };
  }

});


const fs = require('fs');
const serve = require('koa-static');

// Serve static files from the data directory

const dataPath = path.join(__dirname, 'data');
app.use(async (ctx, next) => {
  await next(); // Pass control to the next middleware (in this case, koa-static)
  if (ctx.status === 200 || ctx.status === 206) {
    ctx.set('Accept-Ranges', 'bytes');
  }
});
app.use(serve(dataPath));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});


module.exports = {app} ; 
