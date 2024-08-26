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
const { addSong, fetchSongs, getNextSong, getPreviousSong, getRandomSong, getSongsByGenre, getUserRecentlyListenedSongs, getPaginatedSongs, fetchSongsByArtist } = require('./controllers/songControllers');
const app = new Koa();
const router = new Router();
const {addPlaylist, fetchPlaylists, addSongToPlaylist, fetchSinglePlaylist, fetchPlaylistsOfOwner, togglePlaylistVisibility, getPublicPlaylistsByUserId, getPaginatedPlaylists, getPaginatedSongsOfSinglePlaylist, addSongToLikedSongs, removeSongFromPlaylist} = require('./controllers/playlistControllers');
const { addFollower,checkFollowing } = require('./controllers/followerController');
const { getSearchResults } = require('./controllers/searchController');
const { authMiddleware } = require('./controllers/authController') ; 
const { updateUserFrequentGenres, getSongRecommendations } = require('./controllers/userGenrePreferenceController');

// // Connect to DB
connectToDatabase();

// // Middleware to handle multipart form data (file uploads)
app.use(koaBody({ 
  json:true ,
  multipart: true,
  formidable: {
    uploadDir: path.join('/home/suvankitsahoo/Desktop/spotify project/backend/data/'), // Directory where files will be uploaded
    keepExtensions: true,
  }
}));

// // Handle CORS errors
app.use(cors());

// POST route for /api/login/
router.post('/api/login/', authUser);

// POST route for /api/signup/
router.post('/api/signup/', addUser);

// song routes
router.post('/api/song/' , addSong) ; 

router.get('/api/song/' , fetchSongs) ;

router.post('/api/song/next' , authMiddleware , getNextSong) ; 

router.post('/api/song/previous' , authMiddleware, getPreviousSong) ; 

router.post('/api/song/random', authMiddleware , getRandomSong);

router.get('/api/song/genre/:type/:name' , getSongsByGenre) ; 

router.get('/api/song/recent/:userId' , getUserRecentlyListenedSongs) ; 

router.get('/api/song/:page/:limit' , getPaginatedSongs) ; 

router.get('/api/artist/:artistId' , fetchSongsByArtist); 

// Test route
router.get("/", (ctx) => {
  ctx.body = 'Hello world';
});

// playlist routes 
router.post('/api/playlist' , authMiddleware , addPlaylist) ; 

router.get('/api/playlist' , fetchPlaylists) ; 

router.put('/api/playlist', authMiddleware , addSongToPlaylist);

router.get('/api/playlist/:id' , fetchSinglePlaylist) ; 

router.get('/api/playlist/:playlistId/:page/:limit' , getPaginatedSongsOfSinglePlaylist) ;

router.get('/api/playlist/owner/:id',  fetchPlaylistsOfOwner);

router.put('/api/playlist/toggle/:playlistId', authMiddleware , togglePlaylistVisibility);

router.get('/api/playlist/public/:id' , getPublicPlaylistsByUserId);

router.get('/api/playlist/:page/:limit' , getPaginatedPlaylists) ;

router.put('/api/playlist/remove-song' , removeSongFromPlaylist)

// user routes 

router.get('/api/user/:id' , getUserById)

router.put('/api/user/recent' , authMiddleware , updateUserRecentlyListened);

// follower routes 

router.put('/api/follow', addFollower) ; 

router.post(`/api/follow/check`, authMiddleware , checkFollowing)

// search routes

router.get('/api/search/:searchInput/:selectedFilter' , getSearchResults)

// user genre preference 

router.put('/api/frequent-genre' , updateUserFrequentGenres) ; 

router.get('/api/frequent-genre/:userId' , getSongRecommendations) ; 

// liked songs routes 

router.put('/api/likedSongs' , addSongToLikedSongs)

// router.get('/api/likedSongs/:userId', getLikedSongsByUserId)

// POST route for /api/upload/
router.post('/api/upload/', async (ctx) => {
  const file = ctx.request.files.file; // Assuming the input field name is 'file'
  ctx.body = { message: 'File uploaded successfully', file: file.filepath };
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
