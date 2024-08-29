import { createClient } from "@supabase/supabase-js"
import dotenv from 'dotenv';

import connectDatabase from "../config/database.js";
import { uploadAudioToCloud } from "../config/uploadToCloud.js";

dotenv.config();

export const uploadSong = async (req, res) => {
    try {

        const { file } = req;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileBuffer = file.buffer;
        const fileName = file.originalname;

        const uploadResponse = await uploadAudioToCloud(fileBuffer, fileName);

        if (!uploadResponse) {
            return res.status(500).send('Failed to upload the file to cloud storage.');
        }

        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const uploadedData = supabase
            .storage
            .from('audios')  
            .getPublicUrl(uploadResponse.path);

        const db = await connectDatabase();
        const songsCollection = db.collection('songs');
        const newSong = {
            name: fileName,
            url: uploadedData.data.publicUrl,
        };

        await songsCollection.insertOne(newSong);

        res.status(201).send({
            message: 'File uploaded successfully',
            data: newSong
        });
    } catch (error) {
        res.status(500).send({ message: 'Error uploading file', error: error.message });
    }
};

export const getAllSongs = async (req, res) => {
    try {
        
        const db = await connectDatabase();
        const songsCollection = db.collection('songs');

        const songs = await songsCollection.find({}).toArray();

        if (!songs || songs.length === 0) {
            return res.status(404).json({ message: 'No songs found' });
        }

        res.status(200).json({ message: 'Songs fetched successfully', songs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching songs', error: error.message });
    }
};
