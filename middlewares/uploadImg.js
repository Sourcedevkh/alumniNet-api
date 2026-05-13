const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "alumniNet",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [
      { width: 500, height: 500, crop: "limit" },
      { quality: "auto:eco", fetch_format: "auto" },
    ],
  },
});

const uploadImg = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = uploadImg;