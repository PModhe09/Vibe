# Vibe Web App

This project is a small music player web app built using the MERN stack (MongoDB, Express, React, Node.js). The app allows users to sign up, sign in, select songs from a library, create playlists, play songs, and resume songs from where they left off.

Deployment Link: [Vibe](https://vibe-omega.vercel.app/)

## Features

### 1. User Authentication
- Users can sign up using an email, username and password.
- Users can login in to their account using email and password.

### 2. Songs Library
- Displays a list of publicly available songs in the song library.
- Users can play songs from this library.

### 3. Playlist Management
- Users can create, rename and delete their playlists.
- Users can add songs to their playlists.

### 4. Music Player
- Users can play songs.
- Users can resume songs from where they left off.

## Technology Stack

- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Audio Storage**: Supabase Bucket
- **Audio Playback**: Wavesurfer.js

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/PModhe09/Vibe.git
   cd Vibe
   ```
2. Install Node modules
   ```bash
   cd frontend 
   npm install
   cd ../
   cd backend
   npm install
   ```
3. Setup backend/.env file as provided below
  ``` bash
PORT = 
SUPABASE_URL = 
MONGODB_URI = 
JWT_SECRET = 
 ```
4. Setup frontend/.env files as provided below
Use local backend server or deployed backend server
Deployed Backend URL = https://vibe-backend-ybmd.onrender.com
Local Backend URL = http://localhost:3000
```
VITE_BACKEND_URL = <Backend URL>
```
5. First start Backend server as below
```bash
cd backend
npm start server
```
6. Open a new terminal and start frontend
```bash
cd frontend
npm run dev
```
