const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the UserGenrePreference schema
const UserGenrePreferenceSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
}, {
  collection: 'userGenrePreference', // Specify the collection name
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create the UserGenrePreference model
const UserGenrePreference = mongoose.model('UserGenrePreference', UserGenrePreferenceSchema);

module.exports = UserGenrePreference;
