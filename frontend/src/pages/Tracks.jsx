import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

import useAuthStore from '../stores/useAuthStore';
import useTrackStore from '../stores/useTrackStore';
import SongCard from '../components/SongCard';

const Tracks = ({ onUnauthorized }) => {
    const jwtToken = useAuthStore((state) => state.jwtToken);
    const { tracks, setTracks, setCurrentTrackIndex, setIsPlaying } = useTrackStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSongs = async () => {
            if (!jwtToken) {
                onUnauthorized();
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/songs/`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setTracks(response.data.songs);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    onUnauthorized();
                } else {
                    console.error('Error fetching songs:', error);
                }
            }
        };

        fetchSongs();
    }, [jwtToken, setTracks, onUnauthorized]);

    if (!jwtToken) {
        return null;
    }

    const handleTrackClick = (index) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
    };

    const handlePlayAllClick = () => {
        if (tracks.length > 0) {
            setCurrentTrackIndex(0);
            setIsPlaying(true);
        }
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <div className="w-full max-w-2xl p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg mb-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-semibold text-white">Songs Library</h2>
                    <button 
                        onClick={handlePlayAllClick}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                    >
                        <Play />
                        <span>Play All</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-col space-y-4 w-full max-w-2xl">
                {tracks.map((track, index) => (
                    <SongCard
                        key={track._id}
                        track={track}
                        index={index}
                        onClick={() => handleTrackClick(index)}
                        showAddToPlaylist={true}
                        className="min-h-[120px] p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    />
                ))}
            </div>
        </div>
    );
};

export default Tracks;
