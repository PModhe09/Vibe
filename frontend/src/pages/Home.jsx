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
        const response = await axios.get('https://vibe-backend-ybmd.onrender.com/api/playlist/by-users', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setPlaylists(response.data.playlists);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setShowAuthModal(true); 
        } else {
          console.error('Error fetching playlists:', error);
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
      const response = await axios.post('https://vibe-backend-ybmd.onrender.com/api/playlist/', 
      { name: playlistName },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      
      
      const fetchUpdatedPlaylists = async () => {
          try {
              const response = await axios.get('https://vibe-backend-ybmd.onrender.com/api/playlist/by-users', {
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
    <div className="p-4 space-y-8 bg-white min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <Card
          name="Song Library"
          onClick={handleSongLibraryClick}
          className="border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
        />
      </div>

      {jwtToken && (
        <>
          <h2 className="text-2xl font-semibold text-primary mt-8">All Playlists</h2>
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
              className="border border-gray-200 bg-gray-100 rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300 ease-in-out"
              onClick={() => setIsNameModalOpen(true)}
              style={{ minHeight: '120px' }}
            >
              <span className="text-3xl text-gray-500"><BadgePlus/></span>
            </div>
          </div>
        </>
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
