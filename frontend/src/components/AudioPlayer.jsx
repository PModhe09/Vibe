import React, { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { CirclePlay,CirclePause, StepForward, StepBack } from 'lucide-react';

import useTrackStore from '../stores/useTrackStore';


const AudioPlayer = () => {
    const { currentTrackIndex, setCurrentTrackIndex, tracks } = useTrackStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
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
            waveColor: 'violet',
            progressColor: 'purple',
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

    if (tracks.length === 0) {
        return <div>No tracks available</div>;
    }

    return (
        <div className="text-center mt-12 bg-primary h-25">
            <h1 className="text-2xl text-center mt-2 text-white font-bold mb-4">
                {tracks[currentTrackIndex]?.name || 'Audio Player'}
            </h1>
                <div>
                    <div
                        ref={waveformRef}
                        className="mx-auto w-4/5 h-24 border-2 border-gray-300 shadow-lg mb-5"
                    ></div>
                    <div className="flex justify-between w-4/5 mx-auto mb-2">
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
                    <div className="flex justify-center space-x-4">
                        <button onClick={handlePrev} className="btn" disabled={!isWaveSurferReady}>
                            <StepBack/>
                        </button>
                        <button onClick={handlePlayPause} className="btn" disabled={!isWaveSurferReady}>
                            {isPlaying ? <CirclePause/> : <CirclePlay/>}
                        </button>
                        <button onClick={handleNext} className="btn" disabled={!isWaveSurferReady}>
                            <StepForward/>
                        </button>
                        <div className="mr-3">
                        <label className="flex items-center justify-center space-x-2">
                            <span>Volume:</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                onChange={handleVolumeChange}
                                defaultValue="1"
                                disabled={!isWaveSurferReady}
                            />
                        </label>
                    </div>
                    </div>
                    
                </div>
        </div>
    );
};

export default AudioPlayer;
