const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const User = require("../models/User");
const redis = require("redis");

const redisClient = redis.createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const getSearchResults = async (ctx) => {
  const { searchInput, selectedFilter } = ctx.params;
  const data = {
    artists: [],
    listeners: [],
    songs: [],
    playlists: [],
  };

  // connect to redis server
  try {
    // if (!redisClient.isOpen) await redisClient.connect();
    // const redisKey = `${searchInput}/${selectedFilter}`;
    // // check in cache
    // const cachedResult = await redisClient.get(redisKey);
    // if (cachedResult) {
    //   ctx.body = JSON.parse(cachedResult);
    //   return;
    // }
    // if not found fetch from DB
    if (selectedFilter === "All" || selectedFilter === "Listeners") {
      try {
        const listeners = await User.find({
          username: { $regex: searchInput, $options: "i" },
          role: "listener",
        });
        data.listeners = listeners;
      } catch (error) {
        console.error("Error fetching search results:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
      }
    }

    if (selectedFilter === "All" || selectedFilter === "Songs") {
      try {
        const songs = await Song.find({
          name: { $regex: searchInput, $options: "i" },
        });
        data.songs = songs;
      } catch (error) {
        console.error("Error fetching search results:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
      }
    }
    if (selectedFilter === "All" || selectedFilter === "Playlists") {
      try {
        const playlists = await Playlist.find({
          name: { $regex: searchInput, $options: "i" },
        });
        data.playlists = playlists;
      } catch (error) {
        console.error("Error fetching search results:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
      }
    }

    if (selectedFilter === "All" || selectedFilter === "Artists") {
      try {
        const artists = await User.find({
          username: { $regex: searchInput, $options: "i" },
          role: "artist",
        });
        data.artists = artists;
      } catch (error) {
        console.error("Error fetching search results:", error);
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
      }
    }
    // await redisClient.setEx(redisKey, JSON.stringify(data));
    ctx.body = data;
  } catch (error) {
    ctx.status = 500;
    ctx.body = error.message;
  }
};
module.exports = { getSearchResults };
