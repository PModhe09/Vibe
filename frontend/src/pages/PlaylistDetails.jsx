import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Play } from 'lucide-react';

import useAuthStore from '../stores/useAuthStore';
import useTrackStore from '../stores/useTrackStore';
import NameModal from '../components/modals/NameModal';
import SongCard from '../components/SongCard';

const PlaylistDetails = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const jwtToken = useAuthStore((state) => state.jwtToken);
    const { setTracks, setCurrentTrackIndex, setIsPlaying } = useTrackStore();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            if (!jwtToken) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/playlist/all-songs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setPlaylist(response.data.playlist);
                setTracks(response.data.playlist.songDetails);
            } catch (error) {
                console.error('Error fetching playlist details:', error);
            }
        };

        fetchPlaylistDetails();
    }, [id, jwtToken, setTracks]);

    const handlePlayClick = () => {
        setCurrentTrackIndex(0); 
        setIsPlaying(true);      
    };

    const handleTrackClick = (index) => {
        setCurrentTrackIndex(index); 
        setIsPlaying(true);        
    };

    const handleDeletePlaylist = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/playlist`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                data: { p_id: id },
            });
            console.log('deleted');
            navigate('/'); 
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

    const handleRenamePlaylist = async (newName) => {
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/playlist/${id}`, 
            { newName }, 
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                }
            });
            setPlaylist((prev) => ({ ...prev, name: newName }));
        } catch (error) {
            console.error('Error renaming playlist:', error);
        }
    };

    if (!playlist) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="p-4 flex flex-col items-center">
            <div className="w-full max-w-2xl p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg mb-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-semibold text-white">{playlist.name}</h2>
                    <div className="flex space-x-4">
                        <button 
                            onClick={() => setIsModalOpen(true)} 
                            className="text-white hover:text-gray-300 transition">
                            <Pencil size={20}/>
                        </button>
                        <button 
                            onClick={handleDeletePlaylist} 
                            className="text-white hover:text-gray-300 transition">
                            <Trash2 size={20}/>
                        </button>
                    </div>
                </div>
            </div>

            <button 
                onClick={handlePlayClick} 
                className="flex items-center space-x-2 mb-8 bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
                <Play />
                <span>Play</span>
            </button>

            <div className="w-full max-w-2xl">
                {playlist.songDetails.map((song, index) => (
                    <SongCard
                        key={song._id}
                        track={song}
                        index={index}
                        onClick={() => handleTrackClick(index)}
                        showAddToPlaylist={false}
                        className="min-h-[120px] p-4 mbg-white rounded-lg shadow-md border border-gray-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:font-bold hover:shadow-xl transition duration-300 transform hover:scale-105"
                    />
                ))}
            </div>

            <NameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleRenamePlaylist}
                initialName={playlist.name}
            />
        </div>
    );
};

export default PlaylistDetails;
