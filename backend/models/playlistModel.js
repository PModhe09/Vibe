import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "songs"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Playlist = mongoose.model("playlist", playlistSchema);

export default Playlist;