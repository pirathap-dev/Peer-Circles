// Cloudinary configuration.
// Reads credentials from the environment (backend/.env) so secrets stay out
// of the repo. The `.env` file is git-ignored; `.env.example` only documents
// which variables are expected — it is never read by this module.
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

const ASSET_FOLDER = 'peerApp';

// Fallback upload options used only when no upload preset is set in `.env`.
// When the `datafolder` upload preset is configured it carries its own rules
// (asset folder, unique filename, overwrite, display name, ...) and takes
// precedence over these defaults.
const defaultUploadOptions = {
  resource_type: 'auto',
  type: 'upload',
  asset_folder: ASSET_FOLDER,
  // Do not use the asset folder as the public ID prefix.
  public_id_prefix: false,
  use_filename: false,
  unique_filename: false,
  overwrite: false,
  use_filename_as_display_name: true,
};

let configured = false;

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Ensures the SDK is configured from `.env`; throws if credentials missing.
function getCloudinary() {
  if (!configured) {
    // Values come exclusively from backend/.env (see .env.example for the list).
    cloudinary.config({
      cloud_name: required('CLOUDINARY_CLOUD_NAME'),
      api_key: required('CLOUDINARY_API_KEY'),
      api_secret: required('CLOUDINARY_API_SECRET'),
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

module.exports = {
  getCloudinary,
  ASSET_FOLDER,
  defaultUploadOptions,
};