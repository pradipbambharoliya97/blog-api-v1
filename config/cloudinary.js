const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// configure cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDENARY_CLOUDE_NAME,
  api_key: process.env.CLOUDENARY_CLOUDE_API_KEY,
  api_secret: process.env.CLOUDENARY_CLOUDE_API_SECRET_KEY,
});

// instance of cloudinary storage

const storage = new CloudinaryStorage({
  cloudinary,
  allowdFormates: ["jpg", "png"],
  params: {
    folder: "blog-api",
    tranformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

module.exports = storage;
