import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Menu } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import AudioPlayer from './components/AudioPlayer';
import Tracks from './pages/Tracks';
import PlaylistDetails from './pages/PlaylistDetails';
import useAuthStore from './stores/useAuthStore';
import AuthModal from './components/modals/AuthModal';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(true);
  };

  const handleUnauthorized = () => {
    setModalOpen(true);
    closeSidebar();
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen relative">
        <div
          className={`fixed top-0 left-0 h-full z-40 bg-gray-800 text-white transition-transform duration-300 transform sidebar ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:static md:translate-x-0`}
        >
          <Sidebar 
            onLoginSignupClick={() => setModalOpen(true)} 
            onClose={closeSidebar} // Pass the correct close function
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="md:hidden p-4">
            <Menu onClick={toggleSidebar} height={50} width={60} color='#0BA1A8'/>
          </div>

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
