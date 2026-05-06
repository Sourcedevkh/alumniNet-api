require("dotenv").config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "alumniNet",              // folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "limit" }], // optional: auto resize
  },
});

const fnextension = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpg, jpeg, png, webp)"));
  }
}

const updateAvatar = multer({
  storage: storage,
  fileFilter: fnextension,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
})

const uploadImg = multer({ storage });

module.exports = uploadImg;