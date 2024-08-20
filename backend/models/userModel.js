import mongoose from "mongoose";

const userSchema = new mongoose.Schema({   

  username: {
    type: String,
    required: true,
    unique: true, 
    minlength: 4,
    maxlength: 14
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  playlists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "playlist"
    }
  ]
});

const userModel = mongoose.model("users",userSchema);
export default userModel;