// Upload service wrapping Cloudinary.
const { getCloudinary, defaultUploadOptions } = require('../config/cloudinary');

// Uploads an asset to Cloudinary.
//
// `file` can be:
//   - a base64 data URI  e.g. "data:image/png;base64,iVBORw0KGgo..."
//   - a remote URL
//
// `options` may override the upload preset, resource_type, tags, etc.
async function uploadFile(file, options = {}) {
  if (!file) {
    const error = new Error('FILE_REQUIRED');
    error.code = 'FILE_REQUIRED';
    throw error;
  }

  const cloudinary = getCloudinary();

  // Upload preset name, read from backend/.env. Callers can override per-call.
  const upload_preset =
    options.upload_preset || process.env.CLOUDINARY_UPLOAD_PRESET;

  const { upload_preset: _ignored, ...rest } = options;

  const uploadOptions = {
    ...defaultUploadOptions,
    ...rest,
  };

  // When an upload preset is set in `.env` it carries its own rules (asset
  // folder, unique filename, overwrite, ...) and takes precedence.
  if (upload_preset) {
    uploadOptions.upload_preset = upload_preset;
  }

  try {
    const result = await cloudinary.uploader.upload(file, uploadOptions);
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at,
      bytes: result.bytes,
      display_name: result.display_name || null,
      // Keeps overwrite result field for clients that need it.
      existing: result.existing || false,
    };
  } catch (err) {
    const error = new Error(err.message || 'Cloudinary upload failed.');
    error.code = 'UPLOAD_FAILED';
    error.http_code = err.http_code || err.error?.http_code;
    throw error;
  }
}

module.exports = { uploadFile };