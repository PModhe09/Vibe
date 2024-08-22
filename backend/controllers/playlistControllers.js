import { ObjectId } from "mongodb";

import connectDatabase from "../config/database.js";

export const createPlaylist = async (req, res) => {
    const { name } = req.body;
    const userId = req.userId;

    try {

        const newPlaylist = {
            name,
            userId
          }
    
          const db = await connectDatabase();
          const playlistsCollection = db.collection('playlist');

          const savedPlaylist = await playlistsCollection.insertOne(newPlaylist);
          const usersCollection = db.collection('users');
  
          await usersCollection.updateOne(
            { _id:new ObjectId(userId) },
            { $addToSet: { playlists: { playlistId: savedPlaylist.insertedId, name } } } 
        );
  
        res.status(201).json({ message: 'Playlist created successfully', playlist: savedPlaylist });
    } catch (error) {
        res.status(500).json({ message: 'Error creating playlist', error: error.message });
    }

};

export const deletePlaylist = async (req, res) => {
    const playlistId = req.body.p_id; 
    try {
        const db = await connectDatabase();
        const playlistsCollection = db.collection('playlist');
        const usersCollection = db.collection('users');

        const playlistIdObj = new ObjectId(playlistId);

        const playlist = await playlistsCollection.findOne({ _id: playlistIdObj });
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        const deletedPlaylist = await playlistsCollection.deleteOne({ _id: playlistIdObj });
        if (deletedPlaylist.deletedCount === 0) {
            return res.status(404).json({ message: 'Failed to delete playlist' });
        }

        const updateResult = await usersCollection.updateOne(
            { _id: new ObjectId(playlist.userId) },
            { $pull: { playlists: { playlistId: playlistIdObj } } }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ message: 'Playlist ID not found in user\'s playlists array' });
        }

        res.status(200).json({ message: 'Playlist deleted successfully and removed from user\'s playlists array' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting playlist', error: error.message });
    }
};


export const changeName = async (req, res) => {
    
    try {
        const { playlistId} = req.params;
        const { newName } = req.body;

        const db = await connectDatabase();
        const playlistsCollection = db.collection('playlist');
        const updatedPlaylist = await playlistsCollection.findOneAndUpdate(
            { _id: new ObjectId(playlistId) },
            { $set: { name: newName, updatedAt: new Date() } },
            { returnOriginal: false }
        );

        if (!updatedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.status(200).json({ message: 'Playlist name updated successfully', playlist: updatedPlaylist.value });
    } catch (error) {
        res.status(500).json({ message: 'Error updating playlist name', error: error.message });
    }
};


export const addSongToPlaylist = async (req, res) => {

    try {
        const { playlistId } = req.params;
        const { songId } = req.body;

        const db = await connectDatabase();
        const playlistsCollection = db.collection('playlist');

        const updatedPlaylist = await playlistsCollection.findOneAndUpdate(
            { _id: new ObjectId(playlistId) },
            { 
                $addToSet: { songs: new ObjectId(songId) },  
                $set: { updatedAt: new Date() }           
            },
            { returnOriginal: false } 
        );

        if (!updatedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.status(200).json({ message: 'Song added to playlist successfully', playlist: updatedPlaylist.value });
    } catch (error) {
        res.status(500).json({ message: 'Error adding song to playlist', error: error.message });
    }
};


export const deleteSongFromPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { songId } = req.body;

    try {

        const db = await connectDatabase();
        const playlistsCollection = db.collection('playlist');
        const updatedPlaylist = await playlistsCollection.findOneAndUpdate(
            { _id: new ObjectId(playlistId) },
            { $pull: { songs: new ObjectId(songId) }, $set: { updatedAt: new Date() } },
            { returnOriginal: false }
        );

        if (!updatedPlaylist.value) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.status(200).json({ message: 'Song removed from playlist successfully', playlist: updatedPlaylist.value });

    } catch (error) {
        res.status(500).json({ message: 'Error removing song from playlist', error: error.message });
    }
};

export const getPlaylistByUser = async (req, res) => {
    try {

        const userId = req.userId; 
        const db = await connectDatabase();
        const playlistsCollection = db.collection('playlist');
        const playlistsCursor = await playlistsCollection.find({ userId });
        
        const playlists = await playlistsCursor.toArray(); 
        if (playlists.length === 0) {
            return res.status(404).json({ message: 'No playlists found for this user' });
        }

        res.status(200).json({ message: 'Playlists fetched successfully', playlists });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlists', error: error.message });
    }
};

export const getAllSongsInPlaylist = async(req,res) => {
    try {
        
        const { playlistId } = req.params;
        const db = await connectDatabase();
        const playlistsCollection = db.collection('playlist');
        
        const playlist = await playlistsCollection.aggregate([
            { $match: { _id: new ObjectId(playlistId) } },
            {
                $lookup: {
                    from: 'songs', 
                    localField: 'songs',
                    foreignField: '_id',
                    as: 'songDetails'
                }
            }
        ]).toArray();

        if (!playlist.length) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.status(200).json({ message: 'Playlist fetched successfully', playlist: playlist[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlist with songs', error: error.message });
    }
}
