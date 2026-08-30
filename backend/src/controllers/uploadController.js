// Upload controller.
const { uploadFile } = require('../services/uploadService');

// POST /api/upload
// Body: { file: "data:..." | "<remote url>", upload_preset?: string }
exports.upload = async (req, res) => {
  const { file, upload_preset } = req.body;

  try {
    const result = await uploadFile(file, {
      ...(upload_preset ? { upload_preset } : {}),
    });

    return res.status(201).json({
      message: 'Upload successful.',
      asset: result,
      // Convenience alias so clients can render the image immediately.
      url: result.secure_url,
    });
  } catch (err) {
    if (err.code === 'FILE_REQUIRED') {
      return res.status(400).json({ error: 'No file provided.' });
    }

    if (err.http_code === 401 || err.http_code === 403) {
      return res.status(502).json({ error: 'Cloudinary authentication failed. Check CLOUDINARY_* config.' });
    }

    console.error('Upload error:', err.message || err);
    return res.status(500).json({ error: 'Could not upload asset.' });
  }
};