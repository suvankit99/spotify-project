const Song = require('../models/Song');
const UserGenrePreference = require('../models/UserGenrePreference');
const mongoose = require("mongoose");

const updateUserFrequentGenres = async (ctx) => {
    const { userId, genres } = ctx.request.body;
    console.log("userId : " , userId) ; 
    console.log("genres : " , genres) ; 
    try {
        // Iterate through each genre in the genres array
        for (const genre of genres) {
            // Check if a document with the given userId and genre exists
            const existingPreference = await UserGenrePreference.findOne({ userId, genre });

            if (existingPreference) {
                // If the document exists, increment the count field by 1
                existingPreference.count += 1;
                await existingPreference.save();
            } else {
                // If the document doesn't exist, create a new document with count set to 1
                const newPreference = new UserGenrePreference({
                    userId,
                    genre,
                    count: 1
                });
                await newPreference.save();
            }
        }

        ctx.status = 200;
        ctx.body = { message: "User genre preferences updated successfully." };
    } catch (err) {
        console.error('Error updating user genre preferences:', err);
        ctx.status = 500;
        ctx.body = { error: err.message };
    }
};

const getSongRecommendations = async (ctx) => {
    const { userId } = ctx.params; // Extract userId from request params
  
    try {
      // Fetch the top 3 genres listened to by the user, sorted by count in descending order
      const topGenres = await UserGenrePreference.find({ userId })
        .sort({ count: -1 })
        .limit(3)
        .select('genre'); // Only selecting the 'genre' field
  
      // Extract the genre names from the topGenres array
      const genres = topGenres.map((item) => item.genre);
  
      // Fetch 3 random songs for each of the top genres
      const recommendedSongs = {};
  
      for (const genre of genres) {
        const songs = await Song.aggregate([
          { $match: { genre: { $in: [genre] } } }, // Match songs with the current genre
          { $sample: { size: 4 } }, // Randomly pick 3 songs
        ]);

        recommendedSongs[genre] = songs;
      }
  
      // Send the recommended songs as a response
      ctx.status = 200;
      ctx.body = {
        success: true,
        recommendations: recommendedSongs,
      };
    } catch (error) {
      console.error("Error fetching song recommendations:", error);
  
      // Handle errors and send an error response
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: "Failed to fetch song recommendations",
        error: error.message,
      };
    }
  };

module.exports = { updateUserFrequentGenres , getSongRecommendations };
