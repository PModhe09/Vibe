import React, { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { CirclePlay, CirclePause, StepForward, StepBack, Minimize2, Maximize2,Volume } from 'lucide-react';
import useTrackStore from '../stores/useTrackStore';

const AudioPlayer = () => {
    const { currentTrackIndex, setCurrentTrackIndex, tracks } = useTrackStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const waveformRef = useRef(null);
    const waveSurferRef = useRef(null);
    const [isWaveSurferReady, setIsWaveSurferReady] = useState(false);

    useEffect(() => {
        if (tracks.length === 0) {
            console.warn('No tracks available');
            return;
        }

        // Initialize WaveSurfer instance
        waveSurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#0D9298',
            progressColor: '#0BA1A8',
            height: 100,
            responsive: true,
            autoplay: true,
        });

        // Wait until the WaveSurfer instance is ready
        waveSurferRef.current.on('ready', () => {
            setDuration(waveSurferRef.current.getDuration());
            setIsWaveSurferReady(true);
        });

        // Update current time
        waveSurferRef.current.on('audioprocess', () => {
            setCurrentTime(waveSurferRef.current.getCurrentTime());
        });

        waveSurferRef.current.on('finish', handleNext);

        loadTrack(currentTrackIndex);

        return () => {
            waveSurferRef.current.destroy();
            waveSurferRef.current = null;
        };
    }, [currentTrackIndex, tracks]);

    useEffect(() => {
        if (isWaveSurferReady && waveSurferRef.current && tracks.length > 0) {
            loadTrack(currentTrackIndex);
            setIsPlaying(true);
        }
    }, [currentTrackIndex, isWaveSurferReady]);

    const loadTrack = (index) => {
        if (waveSurferRef.current && tracks[index]) {
            const trackUrl = tracks[index].url;
            if (trackUrl) {
                waveSurferRef.current.load(trackUrl);
                //isPlaying(true);
            } else {
                console.error('Track URL is not defined for track:', tracks[index]);
            }
        } else {
            console.error('WaveSurfer instance or track not available');
        }
    };

    const handlePlayPause = () => {
        if (isWaveSurferReady && waveSurferRef.current) {
            if (isPlaying) {
                waveSurferRef.current.pause();
            } else {
                waveSurferRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } else {
            console.error('WaveSurfer instance is not initialized');
        }
    };

    const handleNext = () => {
        if (isWaveSurferReady && waveSurferRef.current && tracks.length > 0) {
            const nextIndex = (currentTrackIndex + 1) % tracks.length;
            setCurrentTrackIndex(nextIndex);
        } else {
            console.error('WaveSurfer instance or tracks are not available');
        }
    };

    const handlePrev = () => {
        if (isWaveSurferReady && waveSurferRef.current && tracks.length > 0) {
            const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
            setCurrentTrackIndex(prevIndex);
        } else {
            console.error('WaveSurfer instance or tracks are not available');
        }
    };

    const handleVolumeChange = (event) => {
        if (isWaveSurferReady && waveSurferRef.current) {
            waveSurferRef.current.setVolume(event.target.value);
        } else {
            console.error('WaveSurfer instance is not initialized');
        }
    };

    const handleSeek = (event) => {
        if (isWaveSurferReady && waveSurferRef.current) {
            const newTime = event.target.value;
            waveSurferRef.current.seekTo(newTime / duration);
            setCurrentTime(newTime);
        } else {
            console.error('WaveSurfer instance is not initialized');
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleToggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    if (tracks.length === 0) {
        return <></>;
    }

    return (
        <div className={`relative transition-all duration-300 ease-in-out ${isMinimized ? 'h-19 bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl' : 'h-45 bg-gradient-to-r from-blue-600 to-purple-700 p-6 glassmorphism'}`}>
            <div className={`flex flex-col items-center ${isMinimized ? 'hidden' : 'block'}`}>
                <h1 className="text-2xl text-center text-white font-bold mb-4">
                    {tracks[currentTrackIndex]?.name || 'Audio Player'}
                </h1>
                <div
                    ref={waveformRef}
                    className="mx-auto w-4/5 h-24 border-4 border-gray-400 rounded-full"
                ></div>
                <div className="flex justify-between w-4/5 mx-auto mb">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-4/5 mx-auto mb-5"
                    disabled={!isWaveSurferReady}
                />
                <div className="flex justify-center space-x-6 mt-4">
                        <button
                            onClick={handlePrev}
                            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-transform transform hover:scale-110"
                            disabled={!isWaveSurferReady}
                        >
                            <StepBack size={24} />
                        </button>
                        <button
                            onClick={handlePlayPause}
                            className="p-3 rounded-full bg-secondary hover:bg-primary transition-transform transform hover:scale-110"
                            disabled={!isWaveSurferReady}
                        >
                            {isPlaying ? <CirclePause size={24} /> : <CirclePlay size={24} />}
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-transform transform hover:scale-110"
                            disabled={!isWaveSurferReady}
                        >
                            <StepForward size={24} />
                        </button>
                        <label className="flex items-center space-x-2">
                            <span><Volume/></span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={handleVolumeChange}
                                defaultValue="1"
                                className="secondary"
                                disabled={!isWaveSurferReady}
                            />
                        </label>
                    </div>
            </div>
            <button
                onClick={handleToggleMinimize}
                className="absolute top-4 right-4 p-2 bg-white text-primary rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
            >
                {isMinimized ? <Maximize2 /> : <Minimize2/>}
            </button>
            {isMinimized && (
                <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-white font-bold text-lg truncate">{tracks[currentTrackIndex]?.name || 'No Track'}</span>
                </div>
            )}
        </div>
    );
};

export default AudioPlayer;
