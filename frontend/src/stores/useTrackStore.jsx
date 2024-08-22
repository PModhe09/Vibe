import create from 'zustand';

const useTrackStore = create((set) => ({
  currentTrackIndex: 0,
  setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),
  tracks: [],
  setTracks: (newTracks) => set({ tracks: newTracks }),
  isPlaying: false, 
  setIsPlaying: (isPlaying) => set({ isPlaying }),  
}));

export default useTrackStore;
