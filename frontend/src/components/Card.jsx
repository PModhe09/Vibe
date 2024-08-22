import React from 'react';
import musicImage from '../assets/images/music.jpg';

const Card = ({ name, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={onClick}
    >
      <img src={musicImage} alt="Music" className="w-full h-48 object-cover sm:h-32" />
      <div className="p-4">
        <h3 className="text-primary text-xl font-semibold">{name}</h3>
      </div>
    </div>
  );
};

export default Card;