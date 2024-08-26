import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BadgePlus } from 'lucide-react';
import useAuthStore from '../stores/useAuthStore';
import Card from '../components/Card';
import AuthModal from '../components/modals/AuthModal';
import NameModal from '../components/modals/NameModal';

const Home = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const jwtToken = useAuthStore((state) => state.jwtToken);
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
        if (error.response && error.response.status === 401) {
          setShowAuthModal(true);
        } else {
          //console.error('Error fetching playlists:', error);
        }
      }
    };

    fetchPlaylists();
  }, [jwtToken]);

  const handleCardClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleSongLibraryClick = () => {
    if (!jwtToken) {
      setShowAuthModal(true);
    } else {
      navigate('/tracks');
    }
  };

  const handleCreatePlaylist = async (playlistName) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/playlist/`,
        { name: playlistName },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      const fetchUpdatedPlaylists = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/playlist/by-users`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          setPlaylists(response.data.playlists);
        } catch (error) {
          console.error('Error fetching updated playlists:', error);
        }
      };

      await fetchUpdatedPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
    setIsNameModalOpen(false);
  };

  return (
    <div className="p-4 space-y-8 bg-gray-100 min-h-screen">
      <div className="group space-y-4">
        <h2 className="text-3xl text-white  font-semibold bg-gradient-to-r from-primary to-secondary p-4 rounded-lg border relative overflow-hidden shadow-md transition-all duration-300 ease-in-out group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-red-500 group-hover:to-yellow-500 group-hover:font-bold">
          All Songs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <Card
            name="Song Library"
            onClick={handleSongLibraryClick}
            className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
          />
        </div>
      </div>

      {jwtToken && (
        <div className="group space-y-4">
          <h2 className="text-3xl text-white font-semibold bg-gradient-to-r from-primary to-secondary p-4 rounded-lg border relative overflow-hidden shadow-md transition-all duration-300 ease-in-out group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-red-500 group-hover:to-yellow-500 group-hover:font-bold">
            All Playlists
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {playlists.map((playlist) => (
              <Card
                key={playlist._id}
                name={playlist.name}
                onClick={() => handleCardClick(playlist._id)}
                className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
              />
            ))}

            <div
              className="border border-gray-200 bg-white shadow-lg hover:shadow-xl rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500"
              onClick={() => setIsNameModalOpen(true)}
              style={{ minHeight: '120px' }}
            >
              <span className="text-3xl text-gray-500 group-hover:text-white">
                <BadgePlus />
              </span>
            </div>
          </div>
        </div>
      )}

      {isNameModalOpen && (
        <NameModal
          isOpen={isNameModalOpen}
          onClose={() => setIsNameModalOpen(false)}
          onSave={handleCreatePlaylist}
        />
      )}

      {showAuthModal && <AuthModal closeModal={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default Home;
