const User = require("../models/User"); // Import the User model
const { hashPassword, verifyPassword } = require("../utils/hashing");
const { generateToken } = require("./authController");

const getFileName = (fullPath) => fullPath.split("/").pop();

const addUser = async (ctx) => {
  const { username, email, password, role, profilePicture } = ctx.request.body;
  const missingFields = [];

  // Check which fields are missing and add them to the missingFields array
  if (!username) missingFields.push("username");
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");
  if (!role) missingFields.push("role");
  if (!profilePicture) missingFields.push("profilePicture");

  // If there are missing fields, return an error message
  if (missingFields.length > 0) {
    ctx.status = 400;
    ctx.body = {
      message: "Missing required fields",
      missingFields: missingFields.join(", "),
    };
    return;
  }

  try {
    // Encrypt the password before saving
    const encryptedPassword = await hashPassword(password);

    const newUser = new User({
      username: username,
      email: email,
      password: encryptedPassword,
      role: role,
      profilePicture: profilePicture,
    });

    await newUser.save();
    ctx.body = { message: "User created successfully", user: newUser };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: "Error creating user", error };
  }
};


const authUser = async (ctx) => {
  const { email, password } = ctx.request.body;
  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      throw new Error("No such user found");
    }
    const correctPassword = foundUser.password;
    const passwordMatch = await verifyPassword(password, correctPassword);
    if (!passwordMatch) {
      throw new Error("Incorrect credentials provided");
    }
    
    const token = generateToken(foundUser);

    ctx.body = {
      message: "Login Succesful",
      foundUser: foundUser,
      token: token,
    };
  } catch (error) {
    ctx.body = {
      error: error.message,
    };
  }
};

const getUserById = async (ctx) => {
  const { id } = ctx.request.params;
  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      ctx.status = 404;
      ctx.body = {
        error: "No user found with given id",
      };
    }

    ctx.body = foundUser;
  } catch (error) {
    ctx.body = {
      error: error.message,
    };
  }
};

const updateUserRecentlyListened = async (ctx) => {
  const { songId, userId } = ctx.request.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      ctx.status = 404;
      ctx.body = { error: "User not found" };
      return;
    }
    // Ensure that recentlyListenedSongs exists
    if (!user.recentlyListenedSongs) {
      user.recentlyListenedSongs = [];
    }

    // Remove the song if it already exists in the array
    user.recentlyListenedSongs = user.recentlyListenedSongs.filter(
      (id) => !id.equals(songId)
    );

    // Add the new song to the front of the array
    user.recentlyListenedSongs.unshift(songId);

    // If the array exceeds the max size (10), pop the last element
    if (user.recentlyListenedSongs.length > 10) {
      user.recentlyListenedSongs.pop();
    }

    // Save the updated user document
    await user.save();

    ctx.status = 200;
    ctx.body = { message: "Recently listened songs updated successfully" };
  } catch (error) {
    console.error("Error updating recently listened songs:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal server error" };
  }
};

module.exports = {
  addUser,
  authUser,
  getUserById,
  updateUserRecentlyListened,
};
