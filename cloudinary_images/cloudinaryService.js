const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// exports.uploadToCloudinary = async (filePath, folder = 'uploads') => {
//   return cloudinary.uploader.upload(filePath, { folder });
// };
exports.uploadToCloudinary = async (filePath, folder = 'uploads') => {
  return cloudinary.uploader.upload(filePath, { folder });
};

exports.deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
