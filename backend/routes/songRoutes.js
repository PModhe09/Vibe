import express from 'express';
import multer from 'multer';
import { uploadSong,getAllSongs } from '../controllers/songControllers.js';
import { authMiddleware } from '../middlewares/isAuthenticated.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/',authMiddleware,upload.single('song'), uploadSong);
router.get('/',authMiddleware, getAllSongs);

export default router;
