const mongoose = require('mongoose');

// Replace with your MongoDB connection string
const mongoURI = "mongodb+srv://suvankits:12345@spotify-cluster.ijriq.mongodb.net/?retryWrites=true&w=majority&appName=spotify-cluster";

// Function to connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = {
  connectToDatabase
};
