import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50
  },
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Song = mongoose.model("songs", songSchema);

export default Song;