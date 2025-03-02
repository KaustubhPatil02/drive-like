import express from 'express';
import Image from '../models/Image.js';
import Folder from '../models/Folder.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user.id;

    console.log('Search Query:', q);
    console.log('User ID:', userId);

    if (!q) {
      return res.json([]);
    }

    // Search in both folders and images
    const [folders, images] = await Promise.all([
      Folder.find({
        user: userId,
        name: { $regex: q, $options: 'i' }
      }).lean(),
      Image.find({
        user: userId,
        name: { $regex: q, $options: 'i' }
      }).lean()
    ]);

    console.log('Found Folders:', folders.length);
    console.log('Found Images:', images.length);

    const results = [
      ...folders.map(folder => ({
        _id: folder._id.toString(),
        name: folder.name,
        type: 'folder'
      })),
      ...images.map(image => ({
        _id: image._id.toString(),
        name: image.name,
        type: 'file'
      }))
    ];

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Error performing search' });
  }
});

export default router;