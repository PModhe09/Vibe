import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Menu } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import AudioPlayer from './components/AudioPlayer';
import Tracks from './pages/Tracks';
import PlaylistDetails from './pages/PlaylistDetails';
import AuthModal from './components/modals/AuthModal';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
   // console.log('Sidebar toggled:', !isSidebarOpen);
  };

  const handleUnauthorized = () => {
    setModalOpen(true);
    toggleSidebar();
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen relative">
        <div
          className={`fixed top-0 left-0 h-full z-40 text-white transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:static md:translate-x-0 w-64 md:w-64 lg:w-72`}
        >
          <Sidebar 
            onLoginSignupClick={() => setModalOpen(true)} 
            onClose={toggleSidebar} 
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
           <span className="md:hidden p-4 inline-block">
              <Menu onClick={toggleSidebar} height={50} width={60} color='#0BA1A8'/>
           </span>

          <div className="flex-1 p-4 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tracks" element={<Tracks onUnauthorized={handleUnauthorized} />} />
              <Route path="/playlist/:id" element={<PlaylistDetails />} />
            </Routes>
          </div>

          {isAuthenticated && (
            <div className="fixed bottom-0 left-0 right-0 z-50">
              <AudioPlayer />
            </div>
          )}
        </div>

        {isModalOpen && <AuthModal closeModal={closeModal} />}
      </div>
    </BrowserRouter>
  );
};

export default App;
