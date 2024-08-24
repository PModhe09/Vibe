import React, { useState, useEffect } from 'react';
import axios from 'axios';

import useAuthStore from '../stores/useAuthStore';
import musicImage from '../assets/images/music.jpg';

const SongCard = ({ track, index, onClick, showAddToPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const jwtToken = useAuthStore((state) => state.jwtToken);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!jwtToken) return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/playlist/by-users`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setPlaylists(response.data.playlists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, [jwtToken]);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/playlist/add-song/${playlistId}`, 
        { songId: track._id }, 
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Song added to playlist successfully!');
      setShowOptions(false); 
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative flex items-center p-4 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 transition duration-200"
    >
      <div className="flex-shrink-0">
        <img
          src={musicImage}
          alt={track.name}
          className="w-12 h-12 rounded-md"
        />
      </div>
      <div className="text-gray-500 text-sm">{index + 1}</div>
      <div className="ml-4 flex-grow">
        <p className="text-xl font-medium text-gray-800">{track.name}</p>
      </div>
      {showAddToPlaylist && (
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              setShowOptions(!showOptions);
            }}
            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add to Playlist
          </button>
          {showOptions && (
            <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded border border-gray-300 z-10">
              <ul className="list-none m-0 p-0">
                {playlists.map(playlist => (
                  <li
                    key={playlist._id}
                    onClick={() => handleAddToPlaylist(playlist._id)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {playlist.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongCard;
