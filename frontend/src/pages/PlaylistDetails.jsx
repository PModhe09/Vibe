import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

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
                const response = await axios.get(`https://vibe-backend-ybmd.onrender.com/api/playlist/all-songs/${id}`, {
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

    const handleTrackClick = (index) => {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
    };

    const handleDeletePlaylist = async () => {
        try {
            await axios.delete('https://vibe-backend-ybmd.onrender.com/api/playlist', {
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
            await axios.patch(`https://vibe-backend-ybmd.onrender.com/api/playlist/${id}`, 
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
            <div className="flex items-center space-x-4 mb-4">
                <h2 className="text-3xl font-semibold">{playlist.name}</h2>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="text-sm text-blue-500 underline">
                    <Pencil/>
                </button>
                <button 
                    onClick={handleDeletePlaylist} 
                    className="text-sm text-red-500 underline">
                    <Trash2/>
                </button>
            </div>

            <div className="flex flex-col space-y-4">
                {playlist.songDetails.map((song, index) => (
                    <SongCard
                        key={song._id}
                        track={song}
                        index={index}
                        onClick={() => handleTrackClick(index)}
                        showAddToPlaylist={false}
                        className="min-h-[120px] p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
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
