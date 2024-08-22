import create from 'zustand';

const useAuthStore = create((set) => ({
  jwtToken: localStorage.getItem('jwtToken') || null,
  setJwtToken: (token) => {
    if (token === null) {
      localStorage.removeItem('jwtToken');
    } else {
      localStorage.setItem('jwtToken', token);
    }
    set({ jwtToken: token });
  },
  user: null,
  setUser: (user) => set({ user }),
  isAuthenticated: () => !!localStorage.getItem('jwtToken'),
}));

export default useAuthStore;
