import express from 'express'
import { createPlaylist,deletePlaylist,addSongToPlaylist,changeName,deleteSongFromPlaylist,getAllSongsInPlaylist,getPlaylistByUser } from '../controllers/playlistControllers.js';
import { authMiddleware } from '../middlewares/isAuthenticated.js';
const router = express.Router();

router.post('/',authMiddleware, createPlaylist);
router.delete('/',authMiddleware, deletePlaylist);
router.post('/add-song/:playlistId', authMiddleware, addSongToPlaylist);
router.patch('/:playlistId', authMiddleware,changeName);
router.delete('/delete-song',authMiddleware,deleteSongFromPlaylist);
router.get('/all-songs/:playlistId',authMiddleware,getAllSongsInPlaylist);
router.get('/by-users',authMiddleware,getPlaylistByUser)

export default router;
