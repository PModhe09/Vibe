import React from 'react';
import { CirclePlay } from 'lucide-react';
import musicImage from '../assets/images/music.jpg';

const Card = ({ name, onClick }) => {
  return (
    <div
      className="relative bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <CirclePlay size={48} className="text-white" />
      </div>
      <img src={musicImage} alt="Music" className="w-full h-48 object-cover sm:h-32" />
      <div className="p-4">
        <h3 className="text-white text-xl font-semibold">{name}</h3>
      </div>
    </div>
  );
};

export default Card;
