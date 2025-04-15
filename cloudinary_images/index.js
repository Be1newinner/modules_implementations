const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const fs = require('fs');
const { uploadToCloudinary, deleteFromCloudinary } = require('./cloudinaryService.js');
dotenv.config();

const app = express();
const port = 8005;

app.use(express.json());

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const path = req.file.path;
        const result = await uploadToCloudinary(path);

        fs.unlinkSync(path); // remove temp file

        return res.status(200).json({
            message: 'Upload successful',
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed', error: err });
    }
});

// Delete route
app.delete('/delete', async (req, res) => {
    try {
        const { publicId } = req.query;
        console.log(publicId)
        const result = await deleteFromCloudinary(publicId);

        if (result.result !== 'ok') {
            return res.status(400).json({ message: 'Failed to delete image', result });
        }

        return res.status(200).json({ message: 'Image deleted successfully', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Deletion failed', error: err });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to Cloudinary Upload API!');
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
